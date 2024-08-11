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
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FriendService } from '../friend/friend.service';
import { isEqual } from 'lodash';

function applyQueryConditions(
  qb: SelectQueryBuilder<any>,
  query: Record<string, any> | QueryTransferDto | QueryPageTransferDto,
) {
  genWhereConditions(qb, query, 'transfer', [
    'friendId',
    'transferType',
    'transferMode',
  ]);
  const { startDate, endDate } = query;
  if (startDate && endDate) {
    qb.andWhere(
      'transfer.transferTime >= :startDate AND transfer.transferTime <= :endDate',
      { startDate, endDate },
    );
  }
  if (query.transferTypes) {
    qb.andWhere('transfer.transferType IN (:...transferType)', {
      transferType: query.transferTypes.split(','),
    });
  }
}

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(TransferEntity)
    private transfersRepository: Repository<TransferEntity>,
    private readonly friendService: FriendService,
  ) {}

  async create(createTransferDto: CreateTransferDto, user: { id: any }) {
    if (!createTransferDto.friendId) return;
    const transferFriend = await this.friendService.findOne(
      createTransferDto.friendId,
    );
    const body = {
      ...createTransferDto,
      createUser: user?.id,
      transferFriend,
    };
    const transfer = this.transfersRepository.create(body);
    return this.transfersRepository.save(transfer);
  }

  async findAll(query: QueryTransferDto, user: { id: any }) {
    const qb = this.transfersRepository
      .createQueryBuilder('transfer')
      .innerJoin('transfer.createUser', 'user')
      .leftJoinAndSelect('transfer.transferFriend', 'friend')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('transfer.create_time', 'DESC')
      .addOrderBy('transfer.transfer_time', 'DESC');
    applyQueryConditions(qb, query);
    const list = await qb.getMany();
    return list.map((x) => x.toResponseObject());
  }

  async findPage(
    query: QueryPageTransferDto,
    user: { id: any },
  ): Promise<{ list: TransferEntity[]; count: number }> {
    const qb = this.transfersRepository
      .createQueryBuilder('transfer')
      .innerJoin('transfer.createUser', 'user')
      .leftJoinAndSelect('transfer.transferFriend', 'friends')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('transfer.create_time', 'DESC')
      .addOrderBy('transfer.transfer_time', 'DESC');
    applyQueryConditions(qb, query);

    qb.select([
      'transfer.id',
      'transfer.transferTime',
      'transfer.amount',
      'transfer.transferType',
      'transfer.transferMode',
      'transfer.createTime',
      'transfer.remark',
      'friends.id', // Include friends' id
      'friends.name', // Include friends' name
    ]);

    const { list, count } = await queryPage(qb, query);
    return {
      list: list.map((x: { toResponseObject: () => any }) =>
        x.toResponseObject(),
      ),
      count,
    };
  }

  async findOne(id: string) {
    const data = await this.transfersRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.transferFriend', 'friends')
      .where('transfer.id = :id', { id })
      .getOne();
    return data.toResponseObject();
  }

  async update(@Param('id') id: string, updateTransferDto: UpdateTransferDto) {
    const existTransfer = await this.findOne(id);
    if (!existTransfer) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    let transferFriend = existTransfer.transferFriend;
    const newFriendId = updateTransferDto.friendId;
    if (!isEqual(transferFriend?.id, newFriendId)) {
      transferFriend = await this.friendService.findOne(newFriendId);
    }
    const updateExpense = this.transfersRepository.merge(existTransfer, {
      ...updateTransferDto,
      transferFriend,
    });
    return this.transfersRepository.save(updateExpense);
  }

  remove(id: string) {
    return removeRecord(id, this.transfersRepository);
  }

  removeAll(user: any) {
    return this.transfersRepository.delete({ createUser: user });
  }
}
