import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

// import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService, // private httpService: HttpService,
  ) {}

  createToken(user: Partial<UserEntity>) {
    return this.jwtService.sign(user);
  }

  login(user: Partial<UserEntity>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return { token };
  }

  getUser(user: UserEntity) {
    return this.userService.findOne(user.id);
  }
}
