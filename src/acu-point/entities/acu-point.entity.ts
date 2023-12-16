import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MeridianEntity } from '../../meridian/entities/meridian.entity';

@Entity('acu_point')
export class AcuPointEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  name: string;

  @Column({ length: 20 })
  alias: string;

  @ManyToMany(() => MeridianEntity, (meridian) => meridian.acuPointList)
  @JoinTable({
    name: 'acu_point_meridian',
    joinColumns: [{ name: 'acu_point_id' }],
    inverseJoinColumns: [{ name: 'meridian_id' }],
  })
  meridianList: Array<MeridianEntity>; // 归经

  // @ManyToMany(() => MeridianEntity, (meridian) => meridian.acuPointList)
  // meridianList: Array<MeridianEntity>;
}
