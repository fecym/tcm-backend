import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { FriendEntity } from '../../friend/entities/friend.entity';
import { PayTypeEnum, TransferTypeEnum } from '../../enum';
import { UserEntity } from '../../user/entities/user.entity';
import { PayTypeDesc, TransferTypeDesc } from '../../enum/enumDesc';
import { transformDateTime } from '../../utils';

@Entity('transfer')
export class TransferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', name: 'transfer_date' })
  transferDate: Date;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    default: 0,
  })
  amount: number;

  @ManyToOne(() => FriendEntity, (friend) => friend.name)
  @JoinColumn({ name: 'friend_id' })
  transferFriend: FriendEntity;

  @Column({
    type: 'enum',
    enum: TransferTypeEnum,
    name: 'transfer_type',
    default: TransferTypeEnum.BORROW_MONEY,
  })
  transferType: TransferTypeEnum;

  @Column({
    type: 'enum',
    enum: PayTypeEnum,
    name: 'transfer_mode',
    comment: '转账方式',
    default: PayTypeEnum.ALIPAY,
  })
  transferMode: PayTypeEnum;

  @Column({ nullable: true })
  remark: string;

  // 创建人
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

  toResponseObject() {
    const obj: any = { ...this };
    obj.transferModeName = PayTypeDesc[obj.transferMode];
    obj.transferTypeName = TransferTypeDesc[obj.transferType];
    return obj;
  }
}
