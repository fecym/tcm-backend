import { IsString } from 'class-validator';
import { Select } from '../interfaces/select.interface';

export class SelectDto implements Select {
  @IsString()
  label: string;

  @IsString()
  value: string;
}

export function transformSelect(
  entity,
  labelKey = 'name',
  valueKey = 'id',
): SelectDto {
  return {
    label: entity[labelKey],
    value: entity[valueKey],
  };
}
