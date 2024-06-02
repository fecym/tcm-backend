import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateHerbDto } from './dto/create-herb.dto';
import { UpdateHerbDto } from './dto/update-herb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HerbEntity } from './entities/herb.entity';
import { MeridianService } from '../meridian/meridian.service';
import {
  genLikeWhereConditions,
  genWhereConditions,
  isEmpty,
  queryPage,
  removeRecord,
} from '../utils';
import { QueryPageHerbDto, QueryHerbDto } from './dto/query-herb.dto';

@Injectable()
export class HerbsService {
  constructor(
    @InjectRepository(HerbEntity)
    private herbRepository: Repository<HerbEntity>,
    private meridianService: MeridianService,
  ) {}

  async create(
    user,
    createHerbDto: Omit<CreateHerbDto, 'meridians' | 'meridianString'>,
  ) {
    const { meridianIds } = createHerbDto;
    // const exist = await this.herbRepository.findOne({
    //   where: { name },
    // });
    // if (exist) {
    //   throw new HttpException('该本草已存在', HttpStatus.BAD_REQUEST);
    // }

    let meridianList: any[];

    if (isEmpty(meridianIds) || !Array.isArray(meridianIds)) {
      meridianList = [];
    } else {
      meridianList = await this.meridianService.findByIds(meridianIds);
    }

    const data = {
      ...createHerbDto,
      meridianList,
      createUser: user.id,
    };

    console.log(data, '???');
    const newHerb = await this.herbRepository.create(data);
    return (await this.herbRepository.save(newHerb)).id;
  }

  async findAll(query: QueryHerbDto) {
    const qb = this.herbRepository
      .createQueryBuilder('herb')
      .leftJoinAndSelect('herb.meridianList', 'meridianList')
      .leftJoinAndSelect('herb.createUser', 'user')
      .orderBy('herb.create_time', 'DESC');
    genWhereConditions(qb, query, 'herb', [
      'nature',
      'taste',
      'toxic',
      'category',
    ]);
    genLikeWhereConditions(qb, query, 'herb', [
      'name',
      'alias',
      'primaryIndication',
    ]);
    const list = await qb.getMany();
    return list.map((x) => x.toResponseObject());
  }

  async findPage(query: QueryPageHerbDto) {
    const qb = await this.herbRepository
      .createQueryBuilder('herb')
      .leftJoinAndSelect('herb.meridianList', 'meridianList')
      .leftJoinAndSelect('herb.createUser', 'user')
      .orderBy('herb.create_time', 'DESC');
    genWhereConditions(qb, query, 'herb', [
      'nature',
      'taste',
      'toxic',
      'category',
    ]);
    genLikeWhereConditions(qb, query, 'herb', [
      'name',
      'alias',
      'primaryIndication',
    ]);
    const { list, count } = await queryPage(qb, query);
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  async findOne(id) {
    const qb = this.herbRepository
      .createQueryBuilder('herb')
      .leftJoinAndSelect('herb.meridianList', 'meridianList')
      .leftJoinAndSelect('herb.createUser', 'user')
      .where('herb.id=:id', { id });
    // .where('herb.id=:id')
    // .setParameter('id', id);
    const result = await qb.getOne();
    if (!result) {
      throw new HttpException(`id为${id}的本草不存在`, HttpStatus.BAD_REQUEST);
    }
    return result.toResponseObject();
  }

  async findByIds(ids) {
    const list = await this.herbRepository.findByIds(ids);
    return list.map((x) => x.toResponseObject());
  }

  async update(id, updateHerbDto: UpdateHerbDto, user) {
    const exist = await this.herbRepository.findOne({
      where: { id },
    });
    if (!exist) {
      throw new HttpException(`id为${id}的本草不存在`, HttpStatus.NOT_FOUND);
    }
    const { meridianIds } = updateHerbDto;

    let meridianList: any[];

    if (isEmpty(meridianIds) || !Array.isArray(meridianIds)) {
      meridianList = [];
    } else {
      meridianList = await this.meridianService.findByIds(meridianIds);
    }

    const data = {
      ...updateHerbDto,
      meridianList,
      editor: user.id,
    };

    const updateHerb = this.herbRepository.merge(exist, data);
    return (await this.herbRepository.save(updateHerb)).id;
  }

  remove(id) {
    return removeRecord(id, this.herbRepository);
  }
}
