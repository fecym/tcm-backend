import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTransferDto } from './create-transfer.dto';
import { IsDateString, IsEmpty, IsOptional } from 'class-validator';
import { PayTypeEnum } from '../../enum';

export class QueryTransferDto extends PartialType(CreateTransferDto) {
  @ApiPropertyOptional({ description: '转账日期' })
  @IsDateString()
  @IsOptional()
  transferDate: Date;

  @ApiProperty({ description: '转账类型' })
  transferTypes: string | number;

  @ApiProperty({ description: '转账方式' })
  @IsEmpty()
  @IsOptional()
  transferMode: PayTypeEnum;

  @ApiPropertyOptional({ description: '转账朋友id', type: String })
  @IsEmpty()
  @IsOptional()
  friendId: string;

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
