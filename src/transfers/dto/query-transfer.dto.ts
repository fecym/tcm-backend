import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTransferDto } from './create-transfer.dto';
import { IsOptional } from 'class-validator';
import { PayTypeEnum } from '../../enum';

export class QueryTransferDto extends PartialType(CreateTransferDto) {
  @ApiProperty({ description: '转账类型' })
  @IsOptional()
  transferTypes?: string | number;

  @ApiProperty({ description: '转账方式' })
  @IsOptional()
  transferMode?: PayTypeEnum;

  @ApiPropertyOptional({ description: '转账朋友id', type: String })
  @IsOptional()
  friendId?: string;

  @ApiProperty({ description: '开始日期', required: false })
  startDate?: Date;

  @ApiProperty({ description: '结束日期', required: false })
  endDate?: Date;
}

export class QueryPageTransferDto extends PartialType(QueryTransferDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
