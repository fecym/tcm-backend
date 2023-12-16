import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { roleTypes } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @ApiProperty({ description: '密码' })
  // @IsNotEmpty({ message: '请输入密码' })
  password: string;

  @ApiProperty({ description: '用户角色' })
  @IsOptional()
  @IsIn(roleTypes)
  role: string;
}
