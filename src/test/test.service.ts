import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestEntity } from './entities/test.entity';
import { ExpenseService } from '../expense/expense.service';
import { generateDateRange, getRandomNumber } from '../utils';
import { PayTypeEnum } from '../enum';
import { TransfersService } from '../transfers/transfers.service';
import * as dayjs from 'dayjs';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    private readonly expenseService: ExpenseService,
    private readonly transferService: TransfersService,
  ) {}

  getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  }

  batchInsertExpense(user) {
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
    generateDateRange('2024-01-01', dayjs().format('YYYY-MM-DD')).map(
      (date) => {
        this.expenseService
          .create(
            {
              name: this.getRandomItem(arr),
              date,
              amount: getRandomNumber(30, 100),
              expenseType: getRandomNumber(1, 11, 0),
              payType: PayTypeEnum.WECHAT,
              remark: '',
            },
            user,
          )
          .then();
      },
    );
    return 'ok';
  }

  batchInsertTransfer(user) {
    generateDateRange('2024-01-01', dayjs().format('YYYY-MM-DD')).map(
      (transferDate) => {
        this.transferService
          .create(
            {
              transferDate,
              amount: getRandomNumber(1000, 9999),
              transferType: getRandomNumber(0, 4, 0),
              transferMode: PayTypeEnum.WECHAT,
              remark: '',
              friendId: '696fe8c1-9ebd-4a8d-9023-bae991e028ea',
            },
            user,
          )
          .then();
      },
    );
    return 'ok';
  }
}
