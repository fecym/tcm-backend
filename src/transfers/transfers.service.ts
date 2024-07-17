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
import { isEqual } from 'lodash';

function applyQueryConditions(qb, query) {
  genWhereConditions(qb, query, 'transfer', [
    'friendId',
    'transferType',
    'transferMode',
  ]);
  const { startDate, endDate } = query;
  if (startDate && endDate) {
    qb.andWhere(
      'transfer.transferDate >= :startDate AND transfer.transferDate <= :endDate',
      { startDate, endDate },
    );
  }
  if (query.transferTypes) {
    console.log(query.transferTypes.split(','), '====');
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

  async create(createTransferDto: CreateTransferDto, user) {
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

  findAll(query: QueryTransferDto, user) {
    const qb = this.transfersRepository
      .createQueryBuilder('transfer')
      .innerJoin('transfer.createUser', 'user')
      .leftJoinAndSelect('transfer.transferFriend', 'friend')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('transfer.create_time', 'DESC');
    applyQueryConditions(qb, query);
    return qb.getMany().then((list) => list.map((x) => x.toResponseObject()));
  }

  async findPage(
    query: QueryPageTransferDto,
    user,
  ): Promise<{ list: TransferEntity[]; count: number }> {
    const qb = this.transfersRepository
      .createQueryBuilder('transfer')
      .innerJoin('transfer.createUser', 'user')
      .leftJoinAndSelect('transfer.transferFriend', 'friends')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('transfer.create_time', 'DESC');
    await applyQueryConditions(qb, query);

    qb.select([
      'transfer.id',
      'transfer.transferDate',
      'transfer.amount',
      'transfer.transferType',
      'transfer.transferMode',
      'transfer.createTime',
      'transfer.remark',
      'friends.id', // Include friends' id
      'friends.name', // Include friends' name
    ]);

    const { list, count } = await queryPage(qb, query);
    return { list: list.map((x) => x.toResponseObject()), count };
  }

  findOne(id) {
    return this.transfersRepository
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.transferFriend', 'friends')
      .where('transfer.id = :id', { id })
      .getOne()
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
    const updateExpense = this.transfersRepository.merge(existTransfer, {
      ...updateTransferDto,
      transferFriend,
    });
    return this.transfersRepository.save(updateExpense);
  }

  remove(id) {
    return removeRecord(id, this.transfersRepository);
  }
}
