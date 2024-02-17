import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { RoleEnum } from "../../enum";

export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty({ message: '请输入用户名' })
  username: string;

  @ApiProperty({ description: '密码' })
  // @IsNotEmpty({ message: '请输入密码' })
  password: string;

  @ApiProperty({ description: '用户角色' })
  @IsOptional()
  @IsEnum(RoleEnum)
  role: RoleEnum;
}
