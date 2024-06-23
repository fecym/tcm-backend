import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { FriendEntity } from '../../friend/entities/friend.entity';
import { PayTypeEnum } from '../../enum';
import { UserEntity } from '../../user/entities/user.entity';
import { PayTypeDesc } from '../../enum/enumDesc';

@Entity('transfer')
export class TransferEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date', name: 'transfer_date' })
  transferDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => FriendEntity, (friend) => friend.name)
  @JoinColumn({ name: 'friend_id' })
  transferFriend: FriendEntity;

  @Column({
    type: 'enum',
    enum: ['借钱', '还钱'],
    name: 'transfer_type',
    default: '借钱',
  })
  transferType: '借钱' | '还钱';

  @Column({
    type: 'enum',
    enum: PayTypeEnum,
    name: 'transfer_mode',
    comment: '转账方式',
    default: PayTypeEnum.ALIPAY,
  })
  transferMode: PayTypeEnum;

  @Column({ default: false, name: 'is_gift' })
  isGift: boolean;

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
  })
  createTime: Date;

  toResponseObject() {
    const obj: any = { ...this };
    obj.transferModeName = PayTypeDesc[obj.transferMode];
    return obj;
  }
}
