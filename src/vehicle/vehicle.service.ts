import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { QueryPageVehicleDto } from './dto/query-vehicle.dot';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleEntity } from './entities/vehicle.entity';
import { Repository } from 'typeorm';
import { genLikeWhere, genWhere } from '../utils';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    const { licensePlate } = createVehicleDto;
    const existVehicle = await this.vehicleRepository.findOne({
      where: { licensePlate },
    });
    if (existVehicle) {
      throw new HttpException('车辆已存在', HttpStatus.BAD_REQUEST);
    }
    const newVehicle = await this.vehicleRepository.create(createVehicleDto);
    return this.vehicleRepository.save(newVehicle);
  }

  async findAll(query) {
    const qb = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .orderBy('vehicle.create_time', 'DESC');
    genWhere(qb, query, 'vehicle', ['licensePlate']);
    genLikeWhere(qb, query, 'vehicle', ['vehicleOwnerName', 'vehicleTypeName']);
    return qb.getMany();
  }

  async findPage(query: QueryPageVehicleDto) {
    const qb = await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.createUser', 'user')
      .orderBy('vehicle.create_time', 'DESC');
    genLikeWhere(qb, query, 'vehicle', [
      'licensePlate',
      'vehicleOwnerName',
      'vehicleTypeName',
    ]);
    const count = await qb.getCount();
    const { page = 1, size = 10 } = query;
    qb.limit(size);
    qb.offset(size * (page - 1));
    const list = await qb.getMany();
    return { list: list.map((x) => x.toResponseObject()), count };
    // return { list, count };
  }

  findOne(id) {
    return this.vehicleRepository.findOne({ where: { id } });
  }

  async update(id, updateVehicleDto: UpdateVehicleDto) {
    const existVehicle = await this.findOne(id);
    console.log(existVehicle, 'existVehicle');
    if (!existVehicle) {
      throw new HttpException(`id为${id}的车辆不存在`, 401);
    }
    const updateVehicle = this.vehicleRepository.merge(
      existVehicle,
      updateVehicleDto,
    );
    return this.vehicleRepository.save(updateVehicle);
  }

  async remove(id) {
    const exist = await this.vehicleRepository.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(`id为${id}的车辆不存在`, 401);
    }
    await this.vehicleRepository.remove(exist);
    return true;
  }
}
