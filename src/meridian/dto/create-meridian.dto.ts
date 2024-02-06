import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn, IsOptional, IsString } from 'class-validator';

export class CreateMeridianDto {
  @ApiProperty({ description: '全称' })
  @IsNotEmpty({ message: '请输入全称' })
  name: string;

  @ApiProperty({ description: '别名' })
  // @IsNotEmpty({ message: '请输入别名' })
  alias: string;

  @ApiProperty({ description: '子午流注' })
  @IsOptional()
  @IsString()
  midnightNoon?: string;

  @ApiProperty({ description: '灵龟八法' })
  @IsOptional()
  @IsString()
  eightAcuPoint?: string;

  @ApiProperty({ description: '类型', default: 1 })
  @IsOptional()
  @IsIn([1, 2])
  type: number;
}
