import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHerbDto } from './create-herb.dto';
import { MeridianEntity } from '../../meridian/entities/meridian.entity';

export class QueryHerbDto extends PartialType(CreateHerbDto) {
  @ApiProperty({ description: '名称', required: false })
  name: string;

  @ApiProperty({ default: '' })
  nature: string;

  @ApiProperty({ default: '' })
  taste: string;

  @ApiProperty({ description: '归经', required: false })
  meridianList: Array<MeridianEntity>;

  @ApiProperty({ default: '' })
  toxic: string;

  @ApiProperty({ default: '' })
  category: string;
}

export class QueryPageHerbDto extends PartialType(QueryHerbDto) {
  @ApiProperty({ description: '分页', required: false, default: 1 })
  page: number;

  @ApiProperty({ description: '分页', required: false, default: 10 })
  size: number;
}
