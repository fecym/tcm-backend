import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from '../expense/entities/expense.entity';
import { ExpenseModule } from '../expense/expense.module';
import { ExpenseService } from '../expense/expense.service';
import { TestEntity } from './entities/test.entity';
import { FriendEntity } from '../friend/entities/friend.entity';
import { FriendModule } from '../friend/friend.module';
import { LunarService } from '../lunar/lunar.service';
import { TransferEntity } from '../transfers/entities/transfer.entity';
import { TransfersModule } from '../transfers/transfers.module';
import { TransfersService } from '../transfers/transfers.service';
import { BudgetEntity } from '../budget/entities/budget.entity';
import { BudgetModule } from '../budget/budget.module';
import { BudgetService } from '../budget/budget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TestEntity,
      ExpenseEntity,
      FriendEntity,
      TransferEntity,
      BudgetEntity,
    ]),
    TransfersModule,
    ExpenseModule,
    FriendModule,
    BudgetModule,
  ],
  controllers: [TestController],
  providers: [
    TestService,
    ExpenseService,
    LunarService,
    TransfersService,
    BudgetService,
  ],
})
export class TestModule {}
