import { UserInfoDto } from './user-info.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UserQueryDto extends PartialType(UserInfoDto) {
  @ApiProperty({ description: '用户名', required: false })
  username: string;
}

export class UserPageQueryDto extends PartialType(UserQueryDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
