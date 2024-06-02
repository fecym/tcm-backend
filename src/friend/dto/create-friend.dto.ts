import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { GenderEnum, RelationshipEnum } from '../../enum';

export class CreateFriendDto {
  @ApiProperty({ description: '朋友姓名' })
  @IsNotEmpty({ message: '请输入朋友姓名' })
  name: string;

  @ApiProperty({ description: '手机号' })
  mobile?: string;

  @ApiProperty({
    description: '性别',
    enum: GenderEnum,
    default: GenderEnum.MALE,
  })
  @IsOptional()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({
    description: '关系',
    enum: RelationshipEnum,
    default: RelationshipEnum.FRIEND,
  })
  @IsOptional()
  @IsEnum(RelationshipEnum)
  relationship: RelationshipEnum;

  @ApiProperty({ description: '信誉' })
  @IsOptional()
  reputation: number;
}
