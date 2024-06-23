import {
  IsOptional,
  IsDateString,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetLunarInfoDto {
  @ApiPropertyOptional({ description: 'Optional date query parameter' })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  date?: string;
}

export class LunarInfoDto {
  @ApiProperty({ description: '日期' })
  @IsDateString()
  date: string;

  @ApiProperty({ description: '农历年' })
  @IsNumber()
  lYear: number;

  @ApiProperty({ description: '农历月' })
  @IsNumber()
  lMonth: number; // 农历月

  @ApiProperty({ description: '农历日' })
  @IsNumber()
  lDay: number; // 农历日

  @ApiProperty({
    description: '农历月中文名称，如果为闰月，则会在月份前增加 闰 字',
  })
  @IsString()
  monthCn: string; // 农历月中文名称

  @ApiProperty({ description: '农历日中文名称' })
  @IsString()
  dayCn: string; // 农历日中文名称

  @ApiProperty({ description: '生肖' })
  @IsString()
  animal: string; // 生肖

  @ApiProperty({ description: '年的农历叫法（干支）' })
  @IsString()
  gzYear: string; // 年的农历叫法（干支）

  @ApiProperty({ description: '月的农历叫法（干支）' })
  @IsString()
  gzMonth: string; // 月的农历叫法（干支）

  @ApiProperty({ description: '日的农历叫法（干支）' })
  @IsString()
  gzDay: string; // 日的农历叫法(干支)

  @ApiProperty({ description: '公历年' })
  @IsNumber()
  cYear: number; // 公历年

  @ApiProperty({ description: '公历月' })
  @IsNumber()
  cMonth: number; // 公历月

  @ApiProperty({ description: '公历日' })
  @IsNumber()
  cDay: number; // 公历日

  @ApiProperty({ description: '周几' })
  @IsNumber()
  nWeek: number; // 周几

  @ApiProperty({ description: '中文周几' })
  @IsString()
  ncWeek: string; // 中文周几

  @ApiProperty({ description: '是否是闰月' })
  @IsBoolean()
  isLeap: boolean; // 是否是闰月

  @ApiProperty({ description: '是否是今天' })
  @IsBoolean()
  isToday: boolean; // 是否是今天

  @ApiProperty({ description: '是否有节气' })
  @IsBoolean()
  isTerm: boolean; // 是否有节气

  @ApiProperty({ description: '节气，如果没有则返回空字符串' })
  @IsString()
  term: string; // 节气，如果没有则返回空字符串
}
