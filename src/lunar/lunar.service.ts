import { Injectable } from '@nestjs/common';
import * as SolarLunar from 'solarlunar';
import * as dayjs from 'dayjs';
import { generateDateRange } from '../utils';
import { LunarInfoDto } from './lunar.dto';

@Injectable()
export class LunarService {
  getLunarInfo(dateStr: Date): LunarInfoDto {
    const date = dayjs(dateStr);
    const info = SolarLunar.solar2lunar(
      date.year(),
      date.month() + 1,
      date.date(),
    );
    return {
      ...info,
      date: date.format('YYYY-MM-DD'),
    };
  }

  getLunarList(startDate, endDate, reverse = true): LunarInfoDto[] {
    const list = generateDateRange(startDate, endDate).map(this.getLunarInfo);
    return reverse ? list.reverse() : list;
  }
}
