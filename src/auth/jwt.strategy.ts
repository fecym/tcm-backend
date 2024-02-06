import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { StrategyOptions, Strategy, ExtractJwt } from 'passport-jwt';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { InjectRepository } from '@nestjs/typeorm';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('AUTH_SECRET'),
    } as StrategyOptions);
  }

  async validate(user: UserEntity) {
    const existUser = await this.authService.getUser(user);
    if (!existUser) {
      throw new UnauthorizedException('token不正确');
    }
    return existUser;
  }
}
