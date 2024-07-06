import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';
import { ExpenseTypeEnum } from '../../enum';
import { IsEnum, IsString } from 'class-validator';

export class QueryExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiProperty({ description: '消费类型' })
  @IsString()
  expenseTypes: string;

  @ApiProperty({ description: '月份', required: false })
  month: string;

  @ApiProperty({ description: '开始时间', required: false })
  startTime: Date;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: Date;
}

export class QueryPageExpenseDto extends PartialType(QueryExpenseDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
