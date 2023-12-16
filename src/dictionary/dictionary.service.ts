import { Injectable } from '@nestjs/common';
import {
  herbCategoryTypes,
  herbPropTypes,
  herbTasteTypes,
  herbToxicTypes,
} from '../herbs/entities/herb.entity';

@Injectable()
export class DictionaryService {
  getTaste() {
    return herbTasteTypes.map((label) => ({ label, value: label }));
  }

  getNature() {
    return herbPropTypes.map((label) => ({ label, value: label }));
  }

  getToxic() {
    return herbToxicTypes.map((label) => ({ label, value: label }));
  }

  getCategory() {
    return herbCategoryTypes.map((label) => ({ label, value: label }));
  }
}
