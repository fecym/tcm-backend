import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleMaintainDto } from './dto/create-vehicle-maintain.dto';
import { UpdateVehicleMaintainDto } from './dto/update-vehicle-maintain.dto';
import {
  QueryPageVehicleMaintainDto,
  QueryVehicleMaintainDto,
} from './dto/query-vehicle-maintain.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isEmpty, queryPage, removeRecord } from '../utils';
import { VehicleMaintainEntity } from './entities/vehicle-maintain.entity';
import { VehicleService } from '../vehicle/vehicle.service';

@Injectable()
export class VehicleMaintainService {
  constructor(
    @InjectRepository(VehicleMaintainEntity)
    private vehicleMaintainRepository: Repository<VehicleMaintainEntity>,
    private vehicleService: VehicleService,
  ) {}

  async create(createUser, createVehicleMaintainDto: CreateVehicleMaintainDto) {
    const { name, vehicleId } = createVehicleMaintainDto;
    const existVehicleMaintain = await this.vehicleMaintainRepository.findOne({
      where: { name },
    });
    if (existVehicleMaintain) {
      throw new HttpException('维修记录已存在', HttpStatus.BAD_REQUEST);
    }

    if (isEmpty(vehicleId)) {
      throw new HttpException('车辆是必选的', HttpStatus.BAD_REQUEST);
    }

    const vehicle = await this.vehicleService.findOne(vehicleId);
    const data = {
      ...createVehicleMaintainDto,
      createUser,
      vehicle,
    };
    const vehicleMaintain = await this.vehicleMaintainRepository.create(data);
    return this.vehicleMaintainRepository.save(vehicleMaintain);
  }

  async findAll(query: QueryVehicleMaintainDto, user) {
    query.keyword ??= '';
    console.log(query, 'query');
    const qb = this.vehicleMaintainRepository
      .createQueryBuilder('vehicle_maintain')
      .leftJoinAndSelect('vehicle_maintain.vehicle', 'vehicle')
      .innerJoinAndSelect(
        'vehicle_maintain.createUser',
        'user',
        'user.id = :userId',
        {
          userId: user.id,
        },
      )
      .where('vehicle_maintain.name LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .orWhere('vehicle_maintain.customerName LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .orWhere('vehicle.licensePlate LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .orderBy('vehicle_maintain.create_time', 'DESC');

    return qb.getMany();
  }

  async findPage(query: QueryPageVehicleMaintainDto, user) {
    query.keyword ??= '';
    const qb = this.vehicleMaintainRepository
      .createQueryBuilder('vehicle_maintain')
      .innerJoinAndSelect(
        'vehicle_maintain.createUser',
        'user',
        'user.id = :userId',
        {
          userId: user.id,
        },
      )
      .leftJoinAndSelect('vehicle_maintain.vehicle', 'vehicle')
      .where('vehicle_maintain.name LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .orWhere('vehicle_maintain.customerName LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .orWhere('vehicle.licensePlate LIKE :keyword', {
        keyword: `%${query.keyword}%`,
      })
      .orderBy('vehicle_maintain.create_time', 'DESC');
    if (query.vehicleId) {
      qb.where(`vehicle.id = :vehicleId`, { vehicleId: query.vehicleId });
    }
    // genLikeWhereConditions(qb, query, 'vehicle_maintain', ['licensePlate', 'vehicleOwnerName', 'vehicleTypeName',]);
    // genWhereConditions(qb, query, 'vehicle_maintain', ['isOutRepair']);
    // const count = await qb.getCount();
    // const { page = 1, size = 10 } = query;
    // qb.limit(size);
    // qb.offset(size * (page - 1));
    // const list = await qb.getMany();
    const { list, count } = await queryPage(qb, query);
    return { list: list.map((x) => x.toResponseObject()), count };
    // return { list, count };
  }

  getCountByVehicleId(id: string) {
    return this.vehicleMaintainRepository
      .createQueryBuilder('vehicle_maintain')
      .where('vehicle_maintain.vehicle = :id', { id })
      .getCount();
  }

  getLastByVehicleId(id: string) {
    return this.vehicleMaintainRepository
      .createQueryBuilder('vehicle_maintain')
      .where('vehicle_maintain.vehicle = :id', { id })
      .orderBy('vehicle_maintain.create_time', 'DESC')
      .getOne();
  }

  findOne(id: string) {
    // return this.vehicleMaintainRepository.findOne({ where: { id } });
    return this.vehicleMaintainRepository
      .createQueryBuilder('vehicle_maintain')
      .leftJoinAndSelect('vehicle_maintain.createUser', 'user')
      .leftJoinAndSelect('vehicle_maintain.vehicle', 'vehicle')
      .where(`vehicle_maintain.id = :id`, { id })
      .getOne();
  }

  async update(
    id: string,
    createUser,
    updateVehicleMaintainDto: UpdateVehicleMaintainDto,
  ) {
    const existVehicleMaintain = await this.findOne(id);
    console.log(existVehicleMaintain, 'existVehicleMaintain');
    if (!existVehicleMaintain) {
      throw new HttpException(
        `id为${id}的维修记录不存在`,
        HttpStatus.NOT_FOUND,
      );
    }
    const updateVehicle = this.vehicleMaintainRepository.merge(
      existVehicleMaintain,
      updateVehicleMaintainDto,
    );
    return this.vehicleMaintainRepository.save(updateVehicle);
  }

  remove(id: string) {
    return removeRecord(id, this.vehicleMaintainRepository);
  }
}
