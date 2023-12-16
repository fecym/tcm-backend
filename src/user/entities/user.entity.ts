import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { HerbEntity } from '../../herbs/entities/herb.entity';

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

  @Column({ length: 11, nullable: true })
  mobile: string | null;

  @Column('simple-enum', {
    enum: roleTypes,
    default: 'visitor',
  })
  role: string;

  @OneToMany(() => HerbEntity, (herb) => herb.author)
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
    this.password = await bcrypt.hashSync(this.password, 10);
  }
}
