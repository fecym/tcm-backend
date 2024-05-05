import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateVehicleMaintainDto } from './create-vehicle-maintain.dto';

export class QueryVehicleMaintainDto extends PartialType(
  CreateVehicleMaintainDto,
) {
  @ApiProperty({ description: '维修车辆' })
  vehicleId: string;

  @ApiProperty({ description: '维修金额', required: false })
  amount: number;

  @ApiProperty({ description: '维修说明', required: false })
  remark: string;

  @ApiProperty({ description: '关键字', required: false })
  keyword: string;
}

export class QueryPageVehicleMaintainDto extends PartialType(
  QueryVehicleMaintainDto,
) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
