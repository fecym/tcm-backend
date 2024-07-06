import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 从 controller 或者 controller 的方法上获取
    const roles =
      this.reflector.get('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      return false;
    }
    if (user.role === 0) {
      return true;
    }
    const hasRoles = roles.some((role) => +role === user.role);
    if (!hasRoles) {
      throw new ForbiddenException('您没有权限');
    }
    return hasRoles;
  }
}
