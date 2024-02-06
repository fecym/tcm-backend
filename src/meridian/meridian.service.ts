import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMeridianDto } from './dto/create-meridian.dto';
import { UpdateMeridianDto } from './dto/update-meridian.dto';
import { QueryMeridianDto } from './dto/query-meridian.dto';
import { MeridianEntity } from './entities/meridian.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { genLikeWhere, genWhere } from '../utils';

@Injectable()
export class MeridianService {
  constructor(
    @InjectRepository(MeridianEntity)
    private meridianRepository: Repository<MeridianEntity>,
  ) {}

  async create(createMeridianDto: CreateMeridianDto): Promise<MeridianEntity> {
    const { name } = createMeridianDto;
    const existMeridian = await this.meridianRepository.findOne({
      where: { name },
    });
    if (existMeridian) {
      throw new HttpException('经络已存在', HttpStatus.BAD_REQUEST);
    }
    const newMeridian = await this.meridianRepository.create(createMeridianDto);
    return this.meridianRepository.save(newMeridian);
  }

  async findAll(query: QueryMeridianDto) {
    const qb = await this.meridianRepository
      .createQueryBuilder('meridian')
      .orderBy('meridian.create_time', 'DESC');
    genWhere(qb, query, 'meridian', ['type']);
    genLikeWhere(qb, query, 'meridian', ['name', 'alias']);
    return qb.getMany();
  }

  findOne(id) {
    return this.meridianRepository.findOne({ where: { id } });
  }

  findByIds(ids) {
    return this.meridianRepository.findByIds(ids);
  }

  async update(id, updateMeridianDto: UpdateMeridianDto) {
    const existMeridian = await this.meridianRepository.findOne({
      where: { id },
    });
    console.log(existMeridian, 'existMeridian');
    if (!existMeridian) {
      throw new HttpException(`id为${id}的经络不存在`, 401);
    }
    const updateMeridian = this.meridianRepository.merge(
      existMeridian,
      updateMeridianDto,
    );
    return this.meridianRepository.save(updateMeridian);
  }

  async remove(id) {
    const exist = await this.meridianRepository.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(`id为${id}的经络不存在`, 401);
    }
    await this.meridianRepository.remove(exist);
    return true;
  }
}
