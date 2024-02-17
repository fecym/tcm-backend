import { compareSync } from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy } from 'passport-local';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';

export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private usersService: UserService,
  ) {
    super({
      // 如果不是username、password， 在constructor中配置
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }

  async validate(username: string, password: string) {
    // 因为密码是加密后的，没办法直接对比用户名密码，只能先根据用户名查出用户，再比对密码
    // const user = await this.userRepository
    //   .createQueryBuilder('user')
    //   .addSelect('user.password')
    //   .where('user.username=:username', { username })
    //   .getOne();

    let user = await this.usersService.findByUsername(username);
    // 如果根据用户名未找到用户，则尝试根据手机号进行验证
    if (!user) {
      user = await this.usersService.findByMobile(username);
    }
    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }

    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码错误！');
    }

    return user;
  }
}
