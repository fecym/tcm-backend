import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVehicleDto } from './create-vehicle.dto';

export class InfoVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({ description: '车牌照' })
  licensePlate: string;
}
