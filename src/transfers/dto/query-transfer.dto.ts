import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTransferDto } from './create-transfer.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryTransferDto extends PartialType(CreateTransferDto) {
  @ApiPropertyOptional({ description: '转账日期' })
  @IsDateString()
  @IsOptional()
  transferDate: Date;

  @ApiPropertyOptional({ description: '开始日期' })
  @IsDateString()
  @IsOptional()
  startDate;

  @ApiPropertyOptional({ description: '结束日期' })
  @IsDateString()
  @IsOptional()
  endDate;
}

export class QueryPageTransferDto extends PartialType(QueryTransferDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
