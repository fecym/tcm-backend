import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { transformDateTime } from '../../utils';

@Entity('budget')
export class BudgetEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ length: 8, comment: '预算名称' })
  name: string;

  @Column({ comment: '预算金额', type: 'decimal' })
  amount: number;

  @Column({ nullable: true, length: 255 })
  remark: string;

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  createTime: Date;

  @BeforeInsert()
  setDefaultValues() {
    if (!this.createTime) {
      this.createTime = new Date();
    }
  }
}
