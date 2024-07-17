import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExpenseEntity } from '../../expense/entities/expense.entity';
import { GenderEnum, RelationshipEnum } from '../../enum';
import { GenderDesc, RelationshipDesc } from '../../enum/enumDesc';
import { UserEntity } from '../../user/entities/user.entity';
import { transformDateTime } from '../../utils';

@Entity('friend')
export class FriendEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 8, unique: true })
  name: string;

  @Column({ length: 11, nullable: true })
  mobile: string | null;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.OTHER })
  gender: GenderEnum;

  @Column({
    type: 'enum',
    name: 'relationship',
    enum: RelationshipEnum,
    default: RelationshipEnum.PARTNER,
  })
  relationship: RelationshipEnum;

  @Column({
    type: 'float',
    default: 5,
    comment: '信誉',
    precision: 3,
    scale: 1,
  })
  reputation: number;

  @ManyToOne(() => UserEntity, (user) => user.nickname || user.username)
  @JoinColumn({ name: 'create_user_id' })
  createUser: UserEntity;

  @ManyToMany(() => ExpenseEntity, (expense) => expense.friends)
  expenses: ExpenseEntity[];

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  createTime: Date;

  toResponseObject() {
    const obj: any = { ...this };
    obj.genderName = GenderDesc[obj.gender];
    obj.relationshipName = RelationshipDesc[obj.relationship];
    return obj;
  }
}
