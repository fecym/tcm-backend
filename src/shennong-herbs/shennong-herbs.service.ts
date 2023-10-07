import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateShennongHerbDto } from './dto/create-shennong-herb.dto';
import { UpdateShennongHerbDto } from './dto/update-shennong-herb.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShennongHerbEntity } from './entities/shennong-herb.entity';
import { MeridianService } from '../meridian/meridian.service';
import { genLikeWhere, genWhere, isEmpty } from '../utils';
import {
  QueryPageShennongHerbDto,
  QueryShennongHerbDto,
} from './dto/query-shennong-herb.dto';

@Injectable()
export class ShennongHerbsService {
  constructor(
    @InjectRepository(ShennongHerbEntity)
    private herbRepository: Repository<ShennongHerbEntity>,
    private meridianService: MeridianService,
  ) {}

  async create(user, createShennongHerbDto: CreateShennongHerbDto) {
    const { meridianIds } = createShennongHerbDto;
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
      ...createShennongHerbDto,
      meridianList,
      author: user.id,
    };

    const newHerb = await this.herbRepository.create(data);
    return (await this.herbRepository.save(newHerb)).id;
  }

  async findAll(query: QueryShennongHerbDto) {
    const qb = this.herbRepository
      .createQueryBuilder('herb')
      .leftJoinAndSelect('herb.meridianList', 'meridianList')
      .leftJoinAndSelect('herb.author', 'user')
      .orderBy('herb.create_time', 'DESC');
    genWhere(qb, query, 'herb', ['nature', 'taste', 'toxic', 'category']);
    genLikeWhere(qb, query, 'herb', ['name', 'alias', 'primaryIndication']);
    const list = await qb.getMany();
    return list.map((x) => x.toResponseObject());
  }

  async findPage(query: QueryPageShennongHerbDto) {
    const qb = await this.herbRepository
      .createQueryBuilder('herb')
      .leftJoinAndSelect('herb.meridianList', 'meridianList')
      .leftJoinAndSelect('herb.author', 'user')
      .orderBy('herb.create_time', 'DESC');
    genWhere(qb, query, 'herb', ['nature', 'taste', 'toxic', 'category']);
    genLikeWhere(qb, query, 'herb', ['name', 'alias', 'primaryIndication']);
    const count = await qb.getCount();
    const { page = 1, size = 10 } = query;
    qb.limit(size);
    qb.offset(size * (page - 1));
    const list = await qb.getMany();
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  async findOne(id) {
    const qb = this.herbRepository
      .createQueryBuilder('herb')
      .leftJoinAndSelect('herb.meridianList', 'meridianList')
      .leftJoinAndSelect('herb.author', 'user')
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

  async update(id, updateHerbDto: UpdateShennongHerbDto, user) {
    const exist = await this.herbRepository.findOne({
      where: { id },
    });
    if (!exist) {
      throw new HttpException(`id为${id}的本草不存在`, 401);
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

  async remove(id) {
    const exist = await this.herbRepository.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(`id为${id}的本草不存在`, 401);
    }
    await this.herbRepository.remove(exist);
    return true;
  }
}
