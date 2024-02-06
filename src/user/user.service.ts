import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { compareSync } from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPageQueryDto } from './dto/user-query.dto';
import { genLikeWhere, setPassword } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async register(createUser: CreateUserDto) {
    const { username } = createUser;
    const existUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    if (!createUser.password) {
      createUser.password = '000000';
    }
    const newUser = await this.userRepository.create(createUser);
    // save 才会插入数据
    return await this.userRepository.save(newUser);
    // return await this.userRepository.findOne({ where: { username } });
  }

  findOne(id) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(query: UserPageQueryDto) {
    try {
      const qb = await this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.create_time', 'DESC');

      genLikeWhere(qb, query, 'user', [
        'username',
        'nickname',
        'mobile',
        'email',
      ]);

      // qb.where('user.nickname = :email', { email: 'query.email' });
      // qb.where(`user.nickname LIKE :username`, { username: query.username });

      // console.log(qb.expressionMap.wheres, '???');
      const count = await qb.getCount();
      const { page = 1, size = 10 } = query;
      qb.limit(size);
      qb.offset(size * (page - 1));

      const list = await qb.getMany();
      return { list, count };
    } catch (e) {
      console.log(e, '===');
    }
  }

  async updatePassword(id, data) {
    const exist = await this.findOne(id);
    console.log(exist, 'existUser');
    if (!exist) {
      throw new HttpException(`用户不存在`, 401);
    }
    console.log(
      exist,
      data,
      this.comparePassword(data.password, exist.password),
    );
    if (!this.comparePassword(data.password, exist.password)) {
      throw new BadRequestException('密码错误！');
    }

    exist.password = setPassword(data.newPassword);
    return this.userRepository.save(exist);
  }

  async update(id, updateUserDto: UpdateUserDto) {
    const exist = await this.findOne(id);
    console.log(exist, 'existUser');
    if (!exist) {
      throw new HttpException(`用户不存在`, 401);
    }
    const updateUser = this.userRepository.merge(exist, updateUserDto);
    return this.userRepository.save(updateUser);
  }

  async remove(id: string) {
    const exist = await this.userRepository.findOne({ where: { id } });
    if (!exist) {
      throw new HttpException(`用户不存在`, 401);
    }
    await this.userRepository.remove(exist);
    return true;
  }

  comparePassword(password, libPassword) {
    return compareSync(password, libPassword);
  }
}
