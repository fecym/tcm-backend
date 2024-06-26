import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from './entities/friend.entity';
import { Repository, In } from 'typeorm';
import { genLikeWhereConditions, removeRecord } from '../utils';
import { QueryFriendDto } from './dto/query-frient.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendEntity)
    private friendRepository: Repository<FriendEntity>,
  ) {}

  async create(createFriendDto: CreateFriendDto, user) {
    const { name } = createFriendDto;
    const existFriend = await this.friendRepository.findOne({
      where: { name },
    });
    if (existFriend) {
      throw new HttpException('该朋友已存在', HttpStatus.CONFLICT);
    }
    const data = {
      ...createFriendDto,
      createUser: user.id,
    };
    const newFriend = await this.friendRepository.create(data);
    return this.friendRepository.save(newFriend);
  }

  findAll(query: QueryFriendDto, user) {
    const qb = this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.createUser', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('friend.create_time', 'DESC');
    genLikeWhereConditions(qb, query, 'friend', ['name']);
    return qb.getMany().then((list) => list.map((x) => x.toResponseObject()));
  }

  findByIds(ids: string[]) {
    return this.friendRepository.find({ where: { id: In(ids) } });
    // return this.friendRepository
    //   .createQueryBuilder('friends')
    //   .where('friends.id IN (:...ids)', { ids })
    //   .getMany();
  }

  findOne(id) {
    return this.friendRepository
      .findOne({ where: { id } })
      .then((data) => data.toResponseObject());
  }

  async update(id, updateFriendDto: UpdateFriendDto) {
    const existFriend = await this.findOne(id);
    console.log(existFriend, 'existFriend');
    if (!existFriend) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    const updateVehicle = this.friendRepository.merge(
      existFriend,
      updateFriendDto,
    );
    return this.friendRepository.save(updateVehicle);
  }

  remove(id) {
    return removeRecord(id, this.friendRepository);
  }
}
