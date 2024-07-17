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
