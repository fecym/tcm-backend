import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { RoleEnum } from '../../enum';

export class UserInfoDto {
  @ApiProperty({ description: '用户名' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '用户昵称', required: false })
  nickname: string;

  @ApiProperty({ description: '用户头像', required: false })
  avatar: string;

  @ApiProperty({ description: '用户邮箱', required: false })
  email: string;

  @ApiProperty({ description: '手机号', required: false })
  mobile: string;

  @ApiProperty({
    description: '角色',
    enum: RoleEnum,
    default: RoleEnum.visitor,
  })
  role: string;

  // @ApiProperty({ description: '创建时间' })
  // createTime: Date;
}
