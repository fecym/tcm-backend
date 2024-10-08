import * as dayjs from 'dayjs';
import { hashSync } from 'bcryptjs';
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { EntityManager, EntityTarget, Repository } from 'typeorm';
import { DateIntervalEnum } from '../enum';


export * from './query';

export function isEmpty(value: string | any[]) {
  if (Array.isArray(value)) return value.length === 0;
  return value === null || value === undefined || value === '';
}

export function getDuplicateName(str: string) {
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

export function hasExist(
  repository: {
    findOne: (arg0: { where: { [x: number]: any } }) => any;
  },
  key: string,
  value: any,
) {
  return repository.findOne({ where: { [key]: value } });
}

export function removeRecord(id: string, repository: Repository<any>) {
  return hasExist(repository, 'id', id).then((exist: any) => {
    if (!exist) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    return repository.remove(exist).then((res) => !!res);
  });
}

export function formatListResponse(list = []) {
  return list.map((x) => x.toResponseObject());
}

export function formatInfoResponse(data: any) {
  return data?.toResponseObject() ?? null;
}

export function getTableName(
  entityManager: EntityManager,
  entity: EntityTarget<any>,
): string {
  const metadata = entityManager.connection.getMetadata(entity);
  return metadata.tableName;
}

export async function checkReferencedRecords(
  entityManager: EntityManager,
  entity: EntityTarget<any>,
  id: any,
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

export function generateDateRange(
  startDate: Date | string,
  endDate: Date | string,
): Date[] {
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

export function getRandomNumber(min: number, max: number, fractionDigits = 2) {
  return (Math.random() * (max - min) + min).toFixed(fractionDigits);
}

export function getDateRange(
  date: Date | string,
  timeUnit: DateIntervalEnum,
): { start: dayjs.Dayjs; end: dayjs.Dayjs } {
  date ??= dayjs().format('YYYY-MM-DD');
  timeUnit ??= DateIntervalEnum.DAY;
  const inputDate = dayjs(date);

  const dateRange = {
    [DateIntervalEnum.DAY]: () => ({
      start: inputDate.startOf('day'),
      end: inputDate.endOf('day'),
    }),
    [DateIntervalEnum.WEEK]: () => ({
      start: inputDate.startOf('week'),
      end: inputDate.endOf('week'),
    }),
    [DateIntervalEnum.MONTH]: () => ({
      start: inputDate.startOf('month'),
      end: inputDate.endOf('month'),
    }),
    [DateIntervalEnum.YEAR]: () => ({
      start: inputDate.startOf('year'),
      end: inputDate.endOf('year'),
    }),
  };

  if (!dateRange[timeUnit]) {
    throw new Error('Invalid timeUnit');
  }

  return dateRange[timeUnit]();
}
