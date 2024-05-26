import { Injectable } from '@nestjs/common';
import * as SolarLunar from 'solarlunar';
import * as dayjs from 'dayjs';

@Injectable()
export class LunarService {
  getLunarInfo(dateStr: Date) {
    const date = dayjs(dateStr);
    const info = SolarLunar.solar2lunar(
      date.year(),
      date.month() + 1,
      date.date(),
    );
    return {
      ...info,
      solar: date.format('YYYY-MM-DD'),
    };
  }
}
