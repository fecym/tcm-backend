import { Injectable } from '@nestjs/common';
import {
  herbCategoryTypes,
  herbPropTypes,
  herbTasteTypes,
  herbToxicTypes,
} from '../herbs/entities/herb.entity';
import { RoleEnum } from '../enum';

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

  getUserRole() {
    return Object.keys(RoleEnum)
      .filter((key) => !isNaN(RoleEnum[key]))
      .map((key) => ({ label: key, value: RoleEnum[key] }));
  }
}
