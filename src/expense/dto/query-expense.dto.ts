import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PayTypeEnum } from '../../enum';
import { Transform } from 'class-transformer';

export class QueryExpenseDto {
  @ApiPropertyOptional({ description: '消费名称' })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: '支付方式',
    enum: PayTypeEnum,
    default: PayTypeEnum.ALIPAY,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsEnum(PayTypeEnum)
  payType: PayTypeEnum;

  @ApiProperty({ description: '消费类型' })
  @IsString()
  expenseTypes: string;

  @ApiProperty({ description: '月份', required: false })
  month: string;

  @ApiProperty({ description: '开始日期', required: false })
  startDate: Date;

  @ApiProperty({ description: '结束日期', required: false })
  endDate: Date;
}

export class QueryPageExpenseDto extends PartialType(QueryExpenseDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
