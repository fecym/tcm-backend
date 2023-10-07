import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateMeridianDto {
  @ApiProperty({ description: '全称' })
  @IsNotEmpty({ message: '请输入全称' })
  name: string;

  @ApiProperty({ description: '名称' })
  @IsNotEmpty({ message: '请输入名称' })
  alias: string;

  @ApiProperty({ description: '类型', default: 1 })
  @IsOptional()
  @IsIn([1, 2])
  type: number;
}
