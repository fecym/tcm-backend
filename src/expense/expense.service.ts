import {
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpenseEntity } from './entities/expense.entity';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import {
  formatDate,
  formatListResponse,
  genLikeWhereConditions,
  genWhereDateRangeConditions,
  getDateRange,
  isEmpty,
  queryPage,
  removeRecord,
} from '../utils';
import { FriendService } from '../friend/friend.service';
import { isEqual } from 'lodash';
import { LunarService } from '../lunar/lunar.service';
import { DateIntervalEnum } from '../enum';
import { ExpenseTypeDesc } from '../enum/enumDesc';
import * as dayjs from 'dayjs';
import { QueryAnalyzeDto, QueryTotalAmountDto } from './dto/query-analyze.dto';

async function applyQueryConditions(qb, query): Promise<void> {
  if (query.month) {
    const [year, monthNumber] = query.month.split('-').map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);
    genWhereDateRangeConditions(qb, 'expense', startDate, endDate);
  }

  if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    genWhereDateRangeConditions(qb, 'expense', startDate, endDate);
  }

  if (query.expenseTypes) {
    qb.andWhere('expense.expenseType IN (:...expenseType)', {
      expenseType: query.expenseTypes.split(','),
    });
  }

  genLikeWhereConditions(qb, query, 'expense', [
    'expenseType',
    'payType',
    'name',
  ]);
}

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
    private readonly friendService: FriendService,
    private readonly lunarService: LunarService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    user,
  ): Promise<ExpenseEntity> {
    // const exist = await this.expenseRepository.findOne({
    //   where: { createUser: user, date: createExpenseDto.date },
    // });
    // console.log(exist, 'exist');
    // if (exist) {
    //   throw new HttpException('该记录已存在', HttpStatus.CONFLICT);
    // }
    let friends = [];
    if (createExpenseDto.friendIds?.length) {
      friends = await this.friendService.findByIds(createExpenseDto.friendIds);
    }
    const body = {
      ...createExpenseDto,
      friends,
      createUser: user.id,
    };
    const expense = this.expenseRepository.create(body);
    return this.expenseRepository.save(expense);
  }

  async findAll(query, user): Promise<ExpenseEntity[]> {
    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .innerJoin('expense.createUser', 'user')
      .leftJoinAndSelect('expense.friends', 'friends')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('expense.create_time', 'DESC');
    await applyQueryConditions(qb, query);

    qb.select([
      'expense.id',
      'expense.date',
      'expense.remark',
      'expense.amount',
      'expense.expenseType',
      'expense.payType',
      'expense.location',
      'expense.createTime',
      'friends.id', // Include friends' id
      'friends.name', // Include friends' name
    ]);

    return qb.getMany().then(formatListResponse);
  }

  async findPage(
    query,
    user,
  ): Promise<{ list: ExpenseEntity[]; count: number }> {
    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .innerJoin('expense.createUser', 'user')
      .leftJoinAndSelect('expense.friends', 'friends')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('expense.create_time', 'DESC');
    await applyQueryConditions(qb, query);

    const { list, count } = await queryPage(qb, query);
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  async getGroupedByDay(query, user) {
    const { startDate, endDate } = query;
    if (!startDate || !endDate) {
      throw new HttpException(
        `startDate and endDate are required`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .innerJoin('expense.createUser', 'user')
      .leftJoinAndSelect('expense.friends', 'friends')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('expense.date', 'ASC');

    qb.select([
      'expense.id',
      'expense.date',
      'expense.name',
      'expense.amount',
      'expense.expenseType',
      'expense.payType',
      'expense.location',
      'expense.createTime',
      'friends.id', // Include friends' id
      'friends.name', // Include friends' name
    ]);

    const expenses = await qb.getMany().then(formatListResponse);

    const lunarDateList = this.lunarService.getLunarList(startDate, endDate);

    const groupedExpenses = expenses.reduce((acc, expense) => {
      const date = formatDate(expense.date, 'YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(expense);
      return acc;
    }, {});

    return lunarDateList.map((lunarDate) => ({
      ...lunarDate,
      list: groupedExpenses[lunarDate.date] || [],
    }));
  }

  async findOne(id: string) {
    const data = await this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.friends', 'friends')
      .where('expense.id = :id', { id })
      .getOne();
    return data.toResponseObject(true);
  }

  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    const existExpense = await this.findOne(id);
    if (!existExpense) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    let friends = existExpense.friends;
    const friendIds = friends.map((x) => x.id);
    const newFriends = updateExpenseDto.friendIds;
    if (!isEqual(friendIds, newFriends)) {
      existExpense.friends = [];
      friends = await this.friendService.findByIds(newFriends);
    }
    updateExpenseDto.friends = friends;
    const updateExpense = this.expenseRepository.merge(
      existExpense,
      updateExpenseDto,
    );
    return this.expenseRepository.save(updateExpense);
  }

  remove(id: string) {
    return removeRecord(id, this.expenseRepository);
  }

  getAnalyzeTrend(query: any, user: { id: any }) {
    let { startDate, endDate } = query;

    startDate ??= dayjs().startOf('year').format('YYYY-MM-DD');
    endDate ??= dayjs().endOf('year').format('YYYY-MM-DD');

    const map = {
      [DateIntervalEnum.DAY]: '%Y-%m-%d',
      // [DateIntervalEnum.WEEK]: '%Y-%u',
      [DateIntervalEnum.MONTH]: '%Y-%m',
      [DateIntervalEnum.YEAR]: '%Y',
    };
    const { timeUnit } = query;
    const groupByFormat = map[timeUnit] || '%Y-%m-%d';
    if (timeUnit === DateIntervalEnum.WEEK) {
      return this.expenseRepository.query(
        `
          SELECT 
            DATE_FORMAT(DATE_SUB(date, INTERVAL WEEKDAY(date) DAY), '%Y-%m-%d') AS startWeek,
            DATE_FORMAT(DATE_ADD(DATE_SUB(date, INTERVAL WEEKDAY(date) DAY), INTERVAL 6 DAY), '%Y-%m-%d') AS endWeek,
            SUM(amount) as total
          FROM expense
          WHERE create_user_id = ? AND date BETWEEN ? AND ?
          GROUP BY startWeek, endWeek
          ORDER BY startWeek
        `,
        [user.id, startDate, endDate],
      );
    }
    return this.expenseRepository.query(
      `SELECT DATE_FORMAT(date, ?) as period, SUM(amount) as total
       FROM expense
       WHERE create_user_id = ? AND date BETWEEN ? AND ?
       GROUP BY period
       ORDER BY period`,
      [groupByFormat, user.id, startDate, endDate],
    );
  }

  async getAnalyzeType(dto: any, user: { id: any }) {
    let { startDate, endDate } = dto;

    startDate ??= dayjs().startOf('year').format('YYYY-MM-DD');
    endDate ??= dayjs().endOf('year').format('YYYY-MM-DD');
    console.log(dto.expenseTypes, 'dto.expenseTypes');
    const expenseTypeList = !isEmpty(dto.expenseTypes)
      ? dto.expenseTypes?.split(',')
      : [];
    console.log(expenseTypeList, 'expenseTypeList');

    let query = `
       SELECT SUM(amount) as value, expense_type as type, COUNT(*) AS count 
       FROM expense 
       WHERE create_user_id = ? AND date BETWEEN ? AND ?`;

    const queryParams = [user.id, startDate, endDate];

    if (expenseTypeList?.length > 0) {
      query += ` AND expense_type IN (?)`;
      queryParams.push(expenseTypeList);
    }

    query += ` GROUP BY expense_type`;

    const format = (row) => ({ ...row, name: ExpenseTypeDesc[row.type] });

    return this.expenseRepository
      .query(query, queryParams)
      .then((res) => res.map(format));
  }

  getAnalyzeTotalAmount(query: QueryTotalAmountDto, user: any) {
    const { date, timeUnit } = query;
    const { start, end } = getDateRange(date, timeUnit);
    console.log(user.id, 'user.id');
    return this.expenseRepository
      .createQueryBuilder('expense')
      .innerJoin('expense.createUser', 'user')
      .select('SUM(expense.amount)', 'total')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate: start.toDate(),
        endDate: end.toDate(),
      })
      .getRawOne();
  }
}
