import { PartialType } from '@nestjs/swagger';
import { CreateAcuPointDto } from './create-acu-point.dto';

export class UpdateAcuPointDto extends PartialType(CreateAcuPointDto) {}
