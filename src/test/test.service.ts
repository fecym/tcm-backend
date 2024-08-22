import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { ExpenseService } from '../expense/expense.service';
import { generateDateRange, getRandomNumber } from '../utils';
import { ExpenseTypeEnum, PayTypeEnum, TransferTypeEnum } from '../enum';
import { TransfersService } from '../transfers/transfers.service';
import { BudgetService } from '../budget/budget.service';
import * as dayjs from 'dayjs';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    private readonly expenseService: ExpenseService,
    private readonly transferService: TransfersService,
    private readonly budgetService: BudgetService,
  ) {}

  getRandomItem(arr: string | any[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  userCheck(user: any) {
    console.log(user.username, 'user.username');
    if (!user.username.startsWith('test')) {
      throw new HttpException(
        `该操作不可以被执行，请使用测试账号进行操作`,
        HttpStatus.FORBIDDEN,
      );
    }
  }
  batchInsertExpense(user: any) {
    this.userCheck(user);
    const arr = [
      '买烟',
      '台球',
      '买水',
      '零食',
      '晚饭',
      '午饭',
      '早饭',
      '饮料',
      '买药',
      '看电影',
      '买衣服',
      '淘宝购物',
      '其他',
    ];
    const template = 'YYYY-MM-DD';
    generateDateRange(
      dayjs().startOf('year').format(template),
      dayjs().format(template),
    ).map((date) => {
      this.expenseService
        .create(
          {
            name: this.getRandomItem(arr),
            date,
            amount: getRandomNumber(30, 100) as any,
            expenseType: getRandomNumber(1, 11, 0) as ExpenseTypeEnum,
            payType: PayTypeEnum.WECHAT,
            remark: '',
          },
          user,
        )
        .then();
    });
    return 'ok';
  }

  batchInsertTransfer(user: any) {
    this.userCheck(user);
    const template = 'YYYY-MM-DD HH:mm:ss';
    generateDateRange(
      dayjs().startOf('year').format(template),
      dayjs().format(template),
    ).map((transferTime) => {
      this.transferService
        .create(
          {
            transferTime,
            amount: getRandomNumber(1000, 9999) as any,
            transferType: getRandomNumber(0, 4, 0) as TransferTypeEnum,
            transferMode: getRandomNumber(1, 4, 0) as PayTypeEnum,
            remark: '',
            friendId: '696fe8c1-9ebd-4a8d-9023-bae991e028ea',
          },
          user,
        )
        .then();
    });
    return 'ok';
  }
  deleteAllTransfer(user: any) {
    this.userCheck(user);
    return this.transferService.removeAll(user);
  }
  cleanBudgetDirtyData() {
    // this.userCheck(user);
    return this.budgetService.cleanDirtyData();
  }
}
