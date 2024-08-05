import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateBudgetDto {
  @ApiPropertyOptional({ description: '预算名称' })
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: '预算金额' })
  @IsNotEmpty()
  @IsOptional()
  amount: number;

  @ApiPropertyOptional({ description: '预算描述' })
  @IsOptional()
  remark: string;
}
