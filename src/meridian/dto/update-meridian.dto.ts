import { PartialType } from '@nestjs/swagger';
import { CreateMeridianDto } from './create-meridian.dto';

export class UpdateMeridianDto extends PartialType(CreateMeridianDto) {}
