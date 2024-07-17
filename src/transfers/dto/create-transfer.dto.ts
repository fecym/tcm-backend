import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PayTypeEnum, TransferTypeEnum } from '../../enum';

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
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: '转账方式',
    enum: PayTypeEnum,
    default: PayTypeEnum.ALIPAY,
  })
  @IsEnum(PayTypeEnum)
  transferMode: PayTypeEnum;

  @ApiProperty({
    description: '转账类型',
    enum: TransferTypeEnum,
  })
  @IsEnum(TransferTypeEnum)
  transferType: TransferTypeEnum;

  @ApiPropertyOptional({ description: '转账朋友id', type: String })
  @IsNotEmpty()
  @IsOptional()
  friendId: string;
}
