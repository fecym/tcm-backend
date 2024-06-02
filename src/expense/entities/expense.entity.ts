import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { transformDateTime } from '../../utils';
import { UserEntity } from '../../user/entities/user.entity';
import { ExpenseTypeEnum, PayTypeEnum } from '../../enum';
import { FriendEntity } from '../../friend/entities/friend.entity';
import {
  ExpenseTypeDesc,
  GenderDesc,
  PayTypeDesc,
  RelationshipDesc,
} from '../../enum/enumDesc';

// 消费记录表
@Entity('expense')
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    unique: true,
    comment: '消费日期',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  date: Date;

  @Column({
    length: 100,
    comment: '描述',
  })
  remark: string;

  @Column({
    name: 'decimal',
    default: 0,
  })
  amount: number;

  @Column({
    name: 'expense_type',
    comment: '消费类型',
    type: 'enum',
    enum: ExpenseTypeEnum,
    default: ExpenseTypeEnum.DINING,
  })
  expenseType: ExpenseTypeEnum;

  @Column({
    name: 'pay_type',
    type: 'enum',
    comment: '支付类型',
    enum: PayTypeEnum,
    default: PayTypeEnum.ALIPAY,
  })
  payType: PayTypeEnum;

  @Column({ nullable: true, length: 32 })
  location: string;

  @ManyToMany(() => FriendEntity, (friend) => friend.expenses)
  friends: FriendEntity[];

  @ManyToOne(() => UserEntity, (user) => user.nickname)
  @JoinColumn({ name: 'user_id' })
  createUser: UserEntity;

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

  toResponseObject() {
    const obj: any = { ...this };
    obj.expenseTypeName = ExpenseTypeDesc[obj.expenseType];
    obj.payTypeName = PayTypeDesc[obj.payType];
    return obj;
  }
}
