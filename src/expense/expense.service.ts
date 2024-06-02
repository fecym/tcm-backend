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
  genLikeWhereConditions,
  genWhereDateRangeConditions,
  queryPage,
  removeRecord,
} from '../utils';
import { FriendService } from '../friend/friend.service';
import { isEqual } from 'lodash';

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

  genLikeWhereConditions(qb, query, 'expense', ['expense_type', 'pay_type']);
}

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
    private readonly friendService: FriendService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    user,
  ): Promise<ExpenseEntity> {
    const exist = await this.expenseRepository.findOne({
      where: { createUser: user.id, date: createExpenseDto.date },
    });
    if (exist) {
      throw new HttpException('该记录已存在', HttpStatus.CONFLICT);
    }
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
      .leftJoinAndSelect('expense.createUser', 'user')
      .leftJoinAndSelect('expense.friends', 'friends')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('expense.create_time', 'DESC');
    await applyQueryConditions(qb, query);
    return qb.getMany().then((list) => list.map((x) => x.toResponseObject()));
  }

  async findPage(
    query,
    user,
  ): Promise<{ list: ExpenseEntity[]; count: number }> {
    const qb = this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.createUser', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('expense.create_time', 'DESC');
    await applyQueryConditions(qb, query);
    const { list, count } = await queryPage(qb, query);
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  findOne(id: string) {
    return this.expenseRepository
      .findOne({ where: { id } })
      .then((data) => data.toResponseObject());
  }

  async update(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    // return this.expenseRepository.update(+id, updateExpenseDto);
    const existExpense = await this.findOne(id);
    console.log(existExpense, 'existExpense');
    if (!existExpense) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    let friends = existExpense.friends;
    const friendIds = friends.map((x) => x.id);
    const newFriends = updateExpenseDto.friendIds;
    if (!isEqual(friendIds, newFriends)) {
      friends = await this.friendService.findByIds(newFriends);
    }
    const updateExpense = this.expenseRepository.merge(existExpense, {
      ...updateExpenseDto,
      friends,
    });
    return this.expenseRepository.save(updateExpense);
  }

  remove(id: string) {
    return removeRecord(id, this.expenseRepository);
  }
}
