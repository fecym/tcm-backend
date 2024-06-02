import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExpenseTypeEnum, PayTypeEnum, RoleEnum } from '../../enum';

export class CreateExpenseDto {
  @ApiPropertyOptional({ description: '消费日期' })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  date: Date;

  @ApiPropertyOptional({ description: '描述' })
  @IsString()
  // @IsNotEmpty()
  remark?: string;

  @ApiPropertyOptional({ description: '消费金额' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: '消费类型',
    enum: ExpenseTypeEnum,
    default: ExpenseTypeEnum.DINING,
  })
  @IsString()
  @IsOptional()
  @IsEnum(ExpenseTypeEnum)
  expenseType: ExpenseTypeEnum;

  @ApiProperty({
    description: '支付方式',
    enum: PayTypeEnum,
    default: PayTypeEnum.ALIPAY,
  })
  @IsString()
  @IsEnum(PayTypeEnum)
  payType: PayTypeEnum;

  @ApiPropertyOptional({ description: '位置' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '一起的朋友', type: [String] })
  @IsArray()
  @IsOptional()
  friendIds?: string[];
}
