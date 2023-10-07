import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class QueryMeridianDto {
  @ApiProperty({ description: '名称', nullable: true, required: false })
  name: string;

  @ApiProperty({ description: '类型', nullable: true, required: false })
  @IsOptional()
  @IsIn([1, 2])
  type: number;
}
