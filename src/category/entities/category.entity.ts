import { PostsEntity } from 'src/posts/posts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { transformDateTime } from '../../utils';

@Entity('category')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => PostsEntity, (post) => post.category)
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
