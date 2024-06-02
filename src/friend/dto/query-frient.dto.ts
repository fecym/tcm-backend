import { ApiProperty } from '@nestjs/swagger';

export class QueryFriendDto {
  @ApiProperty({ description: '朋友姓名', required: false })
  name: string;
}
