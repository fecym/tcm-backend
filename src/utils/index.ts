import * as dayjs from 'dayjs';
import { hashSync } from 'bcryptjs';
import { HttpException, HttpStatus } from '@nestjs/common';

export * from './query';

export function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  return value === null || value === undefined || value == '';
}

export function getDuplicateName(str) {
  const regex = /'([^']+)'/;
  const match = str.match(regex);
  return match?.[1] ?? '';
}

export function transformDateTime(value: Date): string {
  if (!value) return '';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export function setPassword(password: string) {
  return hashSync(password, 10);
}

export function hasExist(id, repository, key, value) {
  return repository.findOne({ where: { [key]: value } });
}

export function removeRecord(id, repository) {
  return hasExist(id, repository, 'id', id).then((exist) => {
    if (!exist) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    return repository.remove(exist).then((res) => !!res);
  });
}

export async function queryPage(qb, query) {
  const count = await qb.getCount();
  const { page = 1, size = 10 } = query;
  qb.limit(size);
  qb.offset(size * (page - 1));
  const list = await qb.getMany();
  return { count, list };
}
