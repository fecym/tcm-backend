import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
  JoinTable,
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
import { Type } from 'class-transformer';

// 消费记录表
@Entity('expense')
export class ExpenseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'date',
    // unique: true,
    comment: '消费日期',
    transformer: {
      to: (value) => transformDateTime(value, 'YYYY-MM-DD'),
      from: (value) => transformDateTime(value, 'YYYY-MM-DD'),
    },
  })
  date: Date;

  @Column({
    length: 255,
    comment: '描述',
  })
  remark: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
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

  // @OneToMany(() => FriendEntity, (friend) => friend.name)
  // friends: FriendEntity[];

  @ManyToMany(() => FriendEntity)
  @JoinTable({
    name: 'expense_friends', // 连接表的表名
    joinColumn: { name: 'expense_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'friend_id', referencedColumnName: 'id' },
  })
  friends: FriendEntity[];

  @ManyToOne(() => UserEntity, (user) => user.nickname)
  @JoinColumn({ name: 'create_user_id' })
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

  toResponseObject(info = false) {
    const obj: any = { ...this };
    obj.expenseTypeName = ExpenseTypeDesc[obj.expenseType];
    obj.payTypeName = PayTypeDesc[obj.payType];
    obj.friendsName = obj.friends?.map((x) => x.name)?.join(',');
    obj.friendIds = obj.friends?.map((x) => x.id);
    if (!info) {
      delete obj.friends;
    }
    return obj;
  }
}
