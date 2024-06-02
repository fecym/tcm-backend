import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryPageVehicleDto, QueryVehicleDto } from './dto/query-vehicle.dot';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleEntity } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { genWhereOrConditions, queryPage, removeRecord } from '../utils';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto, createUser) {
    const { licensePlate } = createVehicleDto;
    const existVehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
    });
    if (existVehicle) {
      throw new HttpException('车辆已存在', HttpStatus.BAD_REQUEST);
    }
    const body = {
      ...createVehicleDto,
      createUser,
    };
    const newVehicle = this.vehicleRepository.create(body);
    return this.vehicleRepository.save(newVehicle);
  }

  findAll(query: QueryVehicleDto, user) {
    console.log(user, 'user');
    query.keyword ??= '';
    const qb = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .innerJoinAndSelect('vehicle.createUser', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .orderBy('vehicle.create_time', 'DESC');

    genWhereOrConditions(qb, 'vehicle', query, [
      'vehicleOwnerName',
      'vehicleTypeName',
      'licensePlate',
    ]);

    return qb.getMany();
  }

  async findPage(query: QueryPageVehicleDto, user) {
    query.keyword ??= '';
    const qb = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .innerJoinAndSelect('vehicle.createUser', 'user', 'user.id = :userId', {
        userId: user.id,
      })
      .where('user.id = :userId', { userId: user.id })
      .orderBy('vehicle.create_time', 'DESC');

    genWhereOrConditions(qb, 'vehicle', query, [
      'vehicleOwnerName',
      'vehicleTypeName',
      'licensePlate',
    ]);

    const { count, list } = await queryPage(qb, query);
    // const count = await qb.getCount();
    // const { page = 1, size = 10 } = query;
    // qb.limit(size);
    // qb.offset(size * (page - 1));
    // const list = await qb.getMany();
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  findOne(id: string) {
    return this.vehicleRepository.findOne({ where: { id } });
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    const existVehicle = await this.findOne(id);
    console.log(existVehicle, 'existVehicle');
    if (!existVehicle) {
      throw new HttpException(`id为${id}的车辆不存在`, HttpStatus.NOT_FOUND);
    }
    const updateVehicle = this.vehicleRepository.merge(
      existVehicle,
      updateVehicleDto,
    );
    return this.vehicleRepository.save(updateVehicle);
  }

  remove(id: string) {
    return removeRecord(id, this.vehicleRepository);
  }
}
