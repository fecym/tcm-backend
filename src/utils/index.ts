import * as dayjs from 'dayjs';
import { hashSync } from 'bcryptjs';
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager } from 'typeorm';

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

export function transformDateTime(
  value: Date,
  template = 'YYYY-MM-DD HH:mm:ss',
): string {
  return formatDate(value, template);
}

export function formatDate(
  value: Date,
  template = 'YYYY-MM-DD HH:mm:ss',
): string {
  if (!value) return '';
  return dayjs(value).format(template);
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

export function formatListResponse(list = []) {
  return list.map((x) => x.toResponseObject());
}

export function formatInfoResponse(data) {
  return data?.toResponseObject() ?? null;
}

export function getTableName(entityManager: EntityManager, entity): string {
  const metadata = entityManager.connection.getMetadata(entity);
  return metadata.tableName;
}

export async function checkReferencedRecords(
  entityManager: EntityManager,
  entity,
  id,
) {
  const tableName = getTableName(entityManager, entity);
  const relatedRecords = await entityManager.query(
    `SELECT TABLE_NAME, COLUMN_NAME 
     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
     WHERE REFERENCED_TABLE_NAME = ? 
     AND REFERENCED_COLUMN_NAME = 'id' 
     AND REFERENCED_TABLE_SCHEMA = DATABASE()`,
    [tableName],
  );

  for (const record of relatedRecords) {
    const refTableName = record.TABLE_NAME;
    const refColumnName = record.COLUMN_NAME;
    const count = await entityManager.query(
      `SELECT COUNT(*) as count FROM ${refTableName} WHERE ${refColumnName} = ?`,
      [id],
    );
    if (count[0].count > 0) {
      throw new ConflictException(`id为${id}的记录被引用，不可删除`);
    }
  }
}

export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dateRange = [];

  let current = start;
  while (current.isBefore(end) || current.isSame(end, 'day')) {
    dateRange.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }

  return dateRange;
}
