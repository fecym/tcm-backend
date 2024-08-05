import { ApiProperty, PartialType } from '@nestjs/swagger';
import { QueryDateRangeDto } from '../../dto/date.dto';
import { DateIntervalEnum } from '../../enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryAnalyzeDto extends PartialType(QueryDateRangeDto) {
  @ApiProperty({
    description: '时间单位',
    enum: DateIntervalEnum,
    default: DateIntervalEnum.DAY,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(DateIntervalEnum)
  timeUnit: DateIntervalEnum;

  @ApiProperty({
    description: '消费类型',
    required: false,
  })
  @IsString()
  @IsOptional()
  expenseTypes: string;
}

export class QueryTotalAmountDto {
  @ApiProperty({
    description: '时间单位',
    enum: DateIntervalEnum,
    default: DateIntervalEnum.YEAR,
    required: false,
  })
  @IsString()
  @IsOptional()
  @IsEnum(DateIntervalEnum)
  timeUnit: DateIntervalEnum;

  @ApiProperty({ description: '日期', required: false })
  date: Date;
}
