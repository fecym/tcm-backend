import { ApiProperty } from '@nestjs/swagger';

export class QueryDateRangeDto {
  @ApiProperty({ description: '开始日期', required: false })
  startDate: Date;

  @ApiProperty({ description: '结束日期', required: false })
  endDate: Date;
}

export class QueryDatetimeRangeDto {
  @ApiProperty({ description: '开始时间', required: false })
  startTime: Date;

  @ApiProperty({ description: '结束时间', required: false })
  endTime: Date;
}