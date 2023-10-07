import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ShennongHerbEntity } from '../../shennong-herbs/entities/shennong-herb.entity';

@Entity('meridian')
export class MeridianEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string; // 全称

  @Column({ length: 20 })
  alias: string; // 简称或其他名称

  @Column('simple-enum', {
    enum: [1, 2],
    default: 1,
    comment: `1: 十二正经，2: 奇经八脉`,
  })
  type: number;

  @ManyToMany(() => ShennongHerbEntity, (herb) => herb.meridianList)
  herbList: Array<ShennongHerbEntity>;

  // 考虑穴位

  @CreateDateColumn({
    name: 'create_time',
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_time',
  })
  updateTime: Date;
}
