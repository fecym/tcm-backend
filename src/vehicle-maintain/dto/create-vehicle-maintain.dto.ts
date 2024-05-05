import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { YesNo } from '../../enum';

export class CreateVehicleMaintainDto {
  @ApiProperty({ description: '维修工单名称', required: false })
  name: string;

  @ApiProperty({ description: '维修车辆' })
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty({ description: '维修人', required: false })
  maintainUser: string;

  @ApiProperty({ description: '维修类型', required: false })
  maintainTypeName: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: Date;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: Date;

  @ApiProperty({ description: '是否外出维修', required: false })
  @IsEnum(YesNo)
  isOutRepair: YesNo;

  @ApiProperty({ description: '维修地点', required: false })
  repairAddress: string;

  @ApiProperty({ description: '车辆到店时间', required: false })
  storeEntryTime: Date;

  @ApiProperty({ description: '车辆离店时间', required: false })
  storeExitTime: Date;

  @ApiProperty({ description: '外出时间', required: false })
  outRepairTime: Date;

  @ApiProperty({ description: '回来时间', required: false })
  backRepairTime: Date;

  @ApiProperty({ description: '顾客姓名', required: false })
  customerName: string;

  @ApiProperty({ description: '顾客电话', required: false })
  customerTel: string;

  @ApiProperty({ description: '维修金额', required: false })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: '维修说明', required: false })
  remark: string;
}
