import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateHerbDto } from './create-herb.dto';

export class InfoHerbDto extends PartialType(CreateHerbDto) {
  @ApiProperty({ description: '名称', required: false })
  name: string;

  @ApiProperty({ description: '归经' })
  meridians: Array<Partial<any>>;

  @ApiProperty({ description: '作者' })
  authorId: string;

  @ApiProperty({ description: '作者' })
  authorName: string;
}
