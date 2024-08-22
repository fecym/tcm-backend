import { SelectQueryBuilder } from 'typeorm';
import { isEmpty } from './index';
import { VehicleEntity } from 'src/vehicle/entities/vehicle.entity';

export function genWhereConditions(
  qb: SelectQueryBuilder<any>,
  query: Record<string, any>,
  queryBuilderAlias: string,
  keys: string[] = [],
  isLike = false,
) {
  if (!qb || !query || !queryBuilderAlias || keys.length === 0) {
    throw new Error('Invalid arguments provided to genWhereConditions');
  }
  if (isLike) return genLikeWhereConditions(qb, query, queryBuilderAlias, keys);
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

export function genLikeWhereConditions(
  qb: SelectQueryBuilder<any>,
  query: Record<string, any>,
  queryBuilderAlias: string,
  keys: string[] = [],
) {
  if (!qb || !query || !queryBuilderAlias || keys.length === 0) {
    throw new Error('Invalid arguments provided to genLikeWhereConditions');
  }
  keys.forEach((key) => {
    if (!isEmpty(query[key])) {
      qb.andWhere(`${queryBuilderAlias}.${key} LIKE :${key}`, {
        [key]: `%${query[key]}%`,
      });
    }
  });
}

export function genWhereDateRangeConditions(
  qb: SelectQueryBuilder<any>,
  queryBuilderAlias: string,
  startDate: Date,
  endDate: Date,
) {
  qb.andWhere(
    `${queryBuilderAlias}.date >= :startDate AND ${queryBuilderAlias}.date < :endDate`,
    {
      startDate,
      endDate,
    },
  );
}

export function genWhereOrConditions(
  qb: SelectQueryBuilder<VehicleEntity>,
  queryBuilderAlias: string,
  query: Record<string, any>,
  keys: string[] = [],
) {
  // (vehicle.licensePlate LIKE :keyword OR vehicle.vehicleOwnerName LIKE :keyword OR vehicle.vehicleTypeName LIKE :keyword)
  if (keys.length === 0) return;

  const conditions = keys
    .map((key) => `${queryBuilderAlias}.${key} LIKE :keyword`)
    .join(' OR ');
  qb.where(`(${conditions})`, { keyword: `%${query.keyword}%` });
}

export async function queryPage(qb: SelectQueryBuilder<any>, query: any) {
  const count = await qb.getCount();
  const { page = 1, size = 10 } = query;
  qb.limit(size);
  qb.offset(size * (page - 1));
  const list = (await qb.getMany()) ?? [];
  return { count, list };
}
