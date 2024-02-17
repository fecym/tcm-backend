import { PartialType } from '@nestjs/swagger';
import { CreateVehicleMaintainDto } from './create-vehicle-maintain.dto';

export class UpdateVehicleMaintainDto extends PartialType(
  CreateVehicleMaintainDto,
) {}
