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
  queryPage,
  removeRecord,
} from '../utils';
import { FriendService } from '../friend/friend.service';
import { isEqual } from 'lodash';
import { LunarService } from '../lunar/lunar.service';

async function applyQueryConditions(qb, query): Promise<void> {
  if (query.month) {
    const [year, monthNumber] = query.month.split('-').map(Number);
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 1);
    genWhereDateRangeConditions(qb, 'expense', startDate, endDate);
  }

  if (query.startTime && query.endTime) {
    const startDate = new Date(query.startTime);
    const endDate = new Date(query.endTime);
    genWhereDateRangeConditions(qb, 'expense', startDate, endDate);
  }

  if (query.expenseTypes) {
    qb.andWhere('expense.expenseType IN (:...expenseType)', {
      expenseType: query.expenseTypes.split(','),
    });
  }

  genLikeWhereConditions(qb, query, 'expense', [
    'expense_type',
    'pay_type',
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

  findOne(id: string) {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.friends', 'friends')
      .where('expense.id = :id', { id })
      .getOne()
      .then((data) => data.toResponseObject(true));
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
      friends = await this.friendService.findByIds(newFriends);
    }
    existExpense.friends = friends;
    const updateExpense = this.expenseRepository.merge(
      existExpense,
      updateExpenseDto,
    );
    return this.expenseRepository.save(updateExpense);
  }

  remove(id: string) {
    return removeRecord(id, this.expenseRepository);
  }
}
