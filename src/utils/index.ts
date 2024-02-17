import * as dayjs from 'dayjs';
import { hashSync } from 'bcryptjs';
import { SelectQueryBuilder } from 'typeorm';

export function isEmpty(value) {
  if (Array.isArray(value)) return value.length === 0;
  return value === null || value === undefined || value == '';
}

export function getDuplicateName(str) {
  const regex = /'([^']+)'/;
  const match = str.match(regex);
  return match?.[1] ?? '';
}

export function genWhere(
  qb: SelectQueryBuilder<any>,
  query: Record<string, any>,
  queryBuilderAlias: string,
  keys: string[] = [],
  isLike = false,
) {
  if (!qb || !query || !queryBuilderAlias || keys.length === 0) {
    throw new Error('Invalid arguments provided to genWhere');
  }
  if (isLike) return genLikeWhere(qb, query, queryBuilderAlias, keys);
  const excludeKeys = ['page', 'size'];
  keys.forEach((key) => {
    if (!excludeKeys.includes(key) && !isEmpty(query[key])) {
      // qb.where('user.email = :email', { email: 'query.email' });
      qb.andWhere(`${queryBuilderAlias}.${key} = :${key}`, {
        [key]: query[key],
      });
    }
  });
}

export function genLikeWhere(
  qb: SelectQueryBuilder<any>,
  query: Record<string, any>,
  queryBuilderAlias: string,
  keys: string[] = [],
) {
  if (!qb || !query || !queryBuilderAlias || keys.length === 0) {
    throw new Error('Invalid arguments provided to genLikeWhere');
  }
  keys.forEach((key) => {
    if (!isEmpty(query[key])) {
      qb.andWhere(`${queryBuilderAlias}.${key} LIKE :${key}`, {
        [key]: `%${query[key]}%`,
      });
    }
  });
}

export function transformDateTime(value: Date): string {
  if (!value) return '';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

export function setPassword(password: string) {
  return hashSync(password, 10);
}
