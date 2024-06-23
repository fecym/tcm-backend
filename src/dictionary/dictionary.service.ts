import { Injectable } from '@nestjs/common';
import {
  herbCategoryTypes,
  herbPropTypes,
  herbTasteTypes,
  herbToxicTypes,
} from '../herbs/entities/herb.entity';
import {
  ExpenseTypeDesc,
  GenderDesc,
  PayTypeDesc,
  RelationshipDesc,
  RoleDesc,
} from '../enum/enumDesc';

@Injectable()
export class DictionaryService {
  // 通用的转换函数
  enumDescToDict<T extends Record<string, string | number>>(
    enumObject: T,
  ): { label: string | number; value: string | number }[] {
    return Object.keys(enumObject).map((key) => ({
      label: enumObject[key],
      value: key,
    }));
  }

  getFriendRelationship() {
    return this.enumDescToDict(RelationshipDesc);
  }

  getUserRole() {
    return this.enumDescToDict(RoleDesc);
  }

  getPayType() {
    return this.enumDescToDict(PayTypeDesc);
  }

  getExpenseType() {
    return this.enumDescToDict(ExpenseTypeDesc);
  }

  getGender() {
    return this.enumDescToDict(GenderDesc);
  }

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
