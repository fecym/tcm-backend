import { Controller, Get, Query } from '@nestjs/common';
import { LunarService } from './lunar.service';
import { GetLunarInfoDto } from './lunar.dto';

@Controller('lunar')
export class LunarController {
  constructor(private readonly lunarService: LunarService) {}

  @Get()
  getLunarInfo(@Query() query: GetLunarInfoDto) {
    const date = query ? new Date(query.date) : new Date();
    return this.lunarService.getLunarInfo(date);
  }
}
