import { ApiProperty, PartialType } from '@nestjs/swagger';

export class QueryVehicleDto {
  @ApiProperty({ description: '车牌照', required: false })
  licensePlate: string;

  @ApiProperty({ description: '车辆类型', required: false })
  vehicleTypeName: string;

  @ApiProperty({ description: '车主姓名', required: false })
  vehicleOwnerName: string;

  @ApiProperty({ description: '关键字', required: false })
  keyword: string;
}

export class QueryPageVehicleDto extends PartialType(QueryVehicleDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
