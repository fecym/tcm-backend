import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PayTypeEnum } from '../../enum';

export class CreateTransferDto {
  @ApiPropertyOptional({ description: '转账日期' })
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  transferDate: Date;

  @ApiPropertyOptional({ description: '转账描述' })
  @IsString()
  remark?: string;

  @ApiPropertyOptional({ description: '转账金额' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: '转账方式',
    enum: PayTypeEnum,
    default: PayTypeEnum.ALIPAY,
  })
  @IsEnum(PayTypeEnum)
  transferMode: PayTypeEnum;

  @ApiProperty({ description: '转账类型' })
  @IsString()
  transferType: '借钱' | '还钱';

  @ApiPropertyOptional({ description: '是否礼金' })
  @IsOptional()
  isGift: boolean;

  @ApiPropertyOptional({ description: '转账朋友id', type: String })
  @IsNotEmpty()
  @IsOptional()
  friendId: string;
}
