import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import {
  herbCategoryTypes,
  herbPropTypes,
  herbTasteTypes,
  herbToxicTypes,
} from '../entities/herb.entity';

export class CreateHerbDto {
  @ApiProperty({ description: '名称' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '其他称呼', required: false })
  alias: string;

  @ApiProperty({
    description: '性',
    required: false,
    enum: herbPropTypes,
    default: '平',
  })
  nature: string;

  @ApiProperty({
    description: '味',
    required: false,
    enum: herbTasteTypes,
    default: '淡',
  })
  taste: string;

  @ApiProperty({ description: '归经' })
  meridianIds: string[] | number[];

  @ApiProperty({
    description: '毒性',
    required: false,
    enum: herbToxicTypes,
    default: '无毒',
  })
  toxic: string;

  @ApiProperty({
    description: '所属类别',
    required: false,
    enum: herbCategoryTypes,
    default: '上经',
  })
  category: string;

  @ApiProperty({ description: '本经原文', required: false })
  originalText: string;

  @ApiProperty({ description: '产地', required: false })
  placeOrigin: string;

  @ApiProperty({ description: '主治', required: false })
  primaryIndication: string;

  @ApiProperty({ description: '其他', required: false })
  remark: string;
}
