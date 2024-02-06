import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { MeridianEntity } from '../../meridian/entities/meridian.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { InfoHerbDto } from '../dto/Info-herb.dto';

export const herbPropTypes = ['平', '大寒', '寒', '凉', '温', '热', '大热'];

export const herbTasteTypes = ['淡', '酸', '苦', '甘', '辛', '咸'];
export const herbToxicTypes = ['无毒', '有毒', '大毒'];
export const herbCategoryTypes = ['上经', '中经', '下经'];

@Entity('herb')
export class HerbEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ length: 20, unique: true })
  name: string;

  @Column({ nullable: true, length: 20 })
  alias: string; // 其他名称

  @Column('enum', {
    enum: herbPropTypes,
    default: '平',
  })
  nature: string; // 性

  @Column('enum', {
    enum: herbTasteTypes,
    default: '淡',
  })
  taste: string; // 味

  @Column('enum', {
    enum: herbToxicTypes,
    default: '无毒',
  })
  toxic: string; // 是否有毒

  @Column('enum', {
    enum: herbCategoryTypes,
    default: '上经',
  })
  category: string; // 类别

  @ManyToMany(() => MeridianEntity, (meridian) => meridian.herbList)
  @JoinTable({
    name: 'herb_meridian',
    joinColumns: [{ name: 'herb_id' }],
    inverseJoinColumns: [{ name: 'meridian_id' }],
  })
  meridianList: Array<MeridianEntity>; // 归经

  @Column({ name: 'original_text', nullable: true })
  originalText: string; // 本经原文

  @Column({ name: 'place_origin', nullable: true })
  placeOrigin: string; // 产地

  @Column({ name: 'primary_indication', nullable: true })
  primaryIndication: string; // 主治

  @Column({ nullable: true })
  remark: string; // 其他

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @ManyToOne(() => UserEntity, (user) => user.nickname || user.username)
  author: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.nickname || user.username)
  editor: UserEntity;

  toResponseObject(): InfoHerbDto {
    const obj: any = { ...this };
    if (this.meridianList?.length) {
      obj.meridians = this.meridianList.map((item) => {
        return { name: item.name, id: item.id, alias: item.alias };
      });
    }
    if (this.author?.id) {
      obj.authorId = this.author.id;
      obj.authorName = this.author.nickname || this.author.username;
    }
    delete obj.author;
    delete obj.meridianList;
    return obj;
  }
}
