import { PartialType } from '@nestjs/swagger';
import { CreateHerbDto } from './create-herb.dto';

export class UpdateHerbDto extends PartialType(CreateHerbDto) {}
