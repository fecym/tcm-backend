import { Injectable } from '@nestjs/common';
import { CreateAcuPointDto } from './dto/create-acu-point.dto';
import { UpdateAcuPointDto } from './dto/update-acu-point.dto';

@Injectable()
export class AcuPointService {
  create(createAcuPointDto: CreateAcuPointDto) {
    return 'This action adds a new acuPoint';
  }

  findAll() {
    return `This action returns all acuPoint`;
  }

  findOne(id) {
    return `This action returns a #${id} acuPoint`;
  }

  update(id, updateAcuPointDto: UpdateAcuPointDto) {
    return `This action updates a #${id} acuPoint`;
  }

  remove(id) {
    return `This action removes a #${id} acuPoint`;
  }
}
