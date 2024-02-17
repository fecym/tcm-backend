import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @ApiProperty({ description: '车牌照', required: true })
  @IsNotEmpty({ message: '请输入车辆牌照' })
  licensePlate: string;

  @ApiProperty({ description: '车辆类型', required: false })
  vehicleTypeName: string;

  @ApiProperty({ description: '车主姓名', required: false })
  vehicleOwnerName: string;

  @ApiProperty({ description: '车主手机号', required: false })
  vehicleOwnerTel: string;

  @ApiProperty({ description: '其他', required: false })
  remark: string;
}
