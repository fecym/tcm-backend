import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ExpenseEntity } from './entities/expense.entity';
import { FriendModule } from '../friend/friend.module';
import { FriendEntity } from '../friend/entities/friend.entity';
import { LunarService } from '../lunar/lunar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity, FriendEntity]),
    FriendModule,
    AuthModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, LunarService],
})
export class ExpenseModule {}
