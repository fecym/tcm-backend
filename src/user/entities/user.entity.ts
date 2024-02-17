import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { HerbEntity } from '../../herbs/entities/herb.entity';
import { setPassword } from '../../utils';
import { RoleEnum } from '../../enum';

export const roleTypes = ['root', 'author', 'visitor'];

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 100, nullable: true })
  nickname: string;

  // @Column({ select: false })
  @Exclude()
  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string | null;

  @Column({ nullable: true })
  email: string | null;

  @Column({ length: 11, nullable: true, unique: true })
  mobile: string | null;

  @Column('simple-enum', {
    enum: RoleEnum,
    default: RoleEnum.visitor,
  })
  role: RoleEnum;

  @OneToMany(() => HerbEntity, (herb) => herb.createUser)
  herbList: HerbEntity[];

  @Column({
    name: 'create_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Exclude()
  @Column({
    name: 'update_time',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  @BeforeInsert()
  async encryptPwd() {
    this.password = setPassword(this.password);
  }
}
