import { PostsEntity } from 'src/posts/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { transformDateTime } from '../../utils';

@Entity('tag')
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 标签名
  @Column()
  name: string;

  @ManyToMany(() => PostsEntity, (post) => post.tags)
  posts: Array<PostsEntity>;

  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_time',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_time',
    transformer: { to: transformDateTime, from: transformDateTime },
  })
  updateTime: Date;
}
