import { PartialType } from '@nestjs/swagger';
import { CreateShennongHerbDto } from './create-shennong-herb.dto';

export class UpdateShennongHerbDto extends PartialType(CreateShennongHerbDto) {}
