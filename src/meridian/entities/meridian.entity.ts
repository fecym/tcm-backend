import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HerbEntity } from '../../herbs/entities/herb.entity';
import { transformDateTime } from '../../utils';
import { AcuPointEntity } from '../../acu-point/entities/acu-point.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('meridian')
export class MeridianEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, default: null })
  name: string; // 全称

  @Column({ length: 20 })
  alias: string; // 简称或其他名称

  @Column('simple-enum', {
    enum: [1, 2],
    default: 1,
    comment: `1: 十二正经，2: 奇经八脉`,
  })
  type: number;

  @Column({
    length: 4,
    comment: '子午流注时辰',
    nullable: true,
    name: 'midnight_noon',
  })
  midnightNoon: string;

  @Column({
    length: 30,
    comment: '灵龟八法',
    nullable: true,
    name: 'eight_acu_point',
  })
  eightAcuPoint: string;

  @ManyToMany(() => HerbEntity, (herb) => herb.meridianList)
  herbList: Array<HerbEntity>;

  // 关联穴位
  @ManyToMany(() => AcuPointEntity, (acuPoint) => acuPoint.meridianList)
  acuPointList: Array<AcuPointEntity>;

  // @ManyToMany(() => AcuPointEntity, (acuPoint) => acuPoint.meridianList)
  // @JoinTable({
  //   name: 'acu_point_meridian',
  //   joinColumns: [{ name: 'acu_point_id' }],
  //   inverseJoinColumns: [{ name: 'meridian_id' }],
  // })
  // acuPointList: Array<AcuPointEntity>;

  // 备注
  @Column({ nullable: true })
  remark: string;

  // 创建人
  @ManyToOne(() => UserEntity, (user) => user.nickname || user.username)
  @JoinColumn({ name: 'create_user_id' })
  createUser: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.nickname || user.username)
  @JoinColumn({ name: 'update_user_id' })
  updateUser: UserEntity;

  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'update_time',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  updateTime: Date;
}
