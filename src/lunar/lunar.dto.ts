import { IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetLunarInfoDto {
  @ApiPropertyOptional({ description: 'Optional date query parameter' })
  @IsOptional()
  @IsDateString()
  @Type(() => String)
  date?: string;
}
