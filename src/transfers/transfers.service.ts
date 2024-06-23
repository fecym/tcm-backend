import { HttpException, HttpStatus, Injectable, Param } from '@nestjs/common';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import {
  QueryPageTransferDto,
  QueryTransferDto,
} from './dto/query-transfer.dto';
import { genWhereConditions, queryPage, removeRecord } from '../utils';
import { InjectRepository } from '@nestjs/typeorm';
import { TransferEntity } from './entities/transfer.entity';
import { Repository } from 'typeorm';
import { FriendService } from '../friend/friend.service';
import { ExpenseEntity } from '../expense/entities/expense.entity';
import { isEqual } from 'lodash';

function applyQueryConditions(qb, query) {
  genWhereConditions(qb, query, 'transfer', [
    'friendId',
    'transferType',
    'transferMode',
    'isGift',
  ]);
  const { startDate, endDate } = query;
  if (startDate && endDate) {
    qb.andWhere(
      'transfer.transferDate >= :startDate AND transfer.transferDate <= :endDate',
      { startDate, endDate },
    );
  }
}

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(TransferEntity)
    private transfersRepository: Repository<TransferEntity>,
    private readonly friendService: FriendService,
  ) {}

  async create(createTransferDto: CreateTransferDto, user) {
    if (!createTransferDto.friendId) return;
    const transferFriend = await this.friendService.findOne(
      createTransferDto.friendId,
    );
    const data = {
      ...createTransferDto,
      createUser: user?.id,
      transferFriend,
    };
    const newData = await this.transfersRepository.create(data);
    return this.transfersRepository.save(newData);
  }

  findAll(query: QueryTransferDto, user) {
    const qb = this.transfersRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.createUser', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('transfer.create_time', 'DESC');
    applyQueryConditions(qb, query);
    return qb.getMany().then((list) => list.map((x) => x.toResponseObject()));
  }

  async findPage(
    query: QueryPageTransferDto,
    user,
  ): Promise<{ list: ExpenseEntity[]; count: number }> {
    const qb = this.transfersRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.createUser', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('transfer.create_time', 'DESC');
    await applyQueryConditions(qb, query);
    const { list, count } = await queryPage(qb, query);
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  findOne(id) {
    return this.transfersRepository
      .findOne({ where: { id } })
      .then((data) => data.toResponseObject());
  }

  async update(@Param('id') id: string, updateTransferDto: UpdateTransferDto) {
    const existTransfer = await this.findOne(id);
    if (!existTransfer) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    let transferFriend = existTransfer.transferFriend;
    const newFriendId = updateTransferDto.friendId;
    if (!isEqual(transferFriend.id, newFriendId)) {
      transferFriend = await this.friendService.findOne(newFriendId);
    }
    const updateExpense = this.transfersRepository.merge(transferFriend, {
      ...updateTransferDto,
      transferFriend,
    });
    return this.transfersRepository.save(updateExpense);
  }

  remove(id) {
    return removeRecord(id, this.transfersRepository);
  }
}
