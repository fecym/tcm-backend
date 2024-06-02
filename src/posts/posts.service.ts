import { CategoryService } from '../category/category.service';
import { CreatePostDto, PostInfoDto, PostsRo } from './dto/post.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostsEntity } from './posts.entity';
import { TagService } from '../tag/tag.service';
import { queryPage, removeRecord } from '../utils';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  async create(user, post: CreatePostDto): Promise<number> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少文章标题', HttpStatus.BAD_REQUEST);
    }

    const doc = await this.postsRepository.findOne({
      where: { title },
    });
    if (doc) {
      throw new HttpException('文章已存在', HttpStatus.BAD_REQUEST);
    }

    const { tag, category = 0, status, isRecommend } = post;

    const categoryDoc = await this.categoryService.findById(category);

    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const postParam: Partial<PostsEntity> = {
      ...post,
      isRecommend: isRecommend ? 1 : 0,
      category: categoryDoc,
      tags: tags,
      author: user,
    };
    if (status === 'publish') {
      Object.assign(postParam, {
        publishTime: new Date(),
      });
    }

    const newPost: PostsEntity = await this.postsRepository.create({
      ...postParam,
    });
    const created = await this.postsRepository.save(newPost);
    return created.id;
  }

  async findAll(query): Promise<PostsRo> {
    const qb = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'user')
      .orderBy('post.updateTime', 'DESC');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const { list, count } = await queryPage(qb, query);
    return { list: list.map((item) => item.toResponseObject()), count };

    //  使用find 方式实现
    /**
     const { page = 1, size = 10, ...params } = query;
     const result = await this.postsRepository.findAndCount({
      relations: ['category', 'author', "tags"],
      order: {
        id: 'DESC',
      },
      skip: (page - 1) * size,
      take: size,
    });
     const list = result[0].map((item) => item.toResponseObject());
     return { list, count: result[1] };
     */
  }

  async findById(id): Promise<any> {
    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'user');
    // .where('post.id=:id')
    // .setParameter('id', id);

    qb.where('post.id=:id', { id });

    const result = await qb.getOne();
    if (!result)
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    await this.postsRepository.update(id, { count: result.count + 1 });

    return result.toResponseObject();
  }

  async updateById(id, post): Promise<number> {
    const existPost = await this.postsRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id为${id}的文章不存在`, HttpStatus.BAD_REQUEST);
    }

    const { category, tag, status } = post;
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const categoryDoc = await this.categoryService.findById(category);
    const newPost = {
      ...post,
      isRecommend: post.isRecommend ? 1 : 0,
      category: categoryDoc,
      tags,
      publishTime: status === 'publish' ? new Date() : existPost.publishTime,
    };

    const updatePost = this.postsRepository.merge(existPost, newPost);
    return (await this.postsRepository.save(updatePost)).id;
  }

  async updateViewById(id) {
    const post = await this.postsRepository.findOne({ where: { id } });
    const updatePost = await this.postsRepository.merge(post, {
      count: post.count + 1,
    });
    this.postsRepository.save(updatePost);
  }

  async getArchives() {
    return await this.postsRepository
      .createQueryBuilder('post')
      .select([`DATE_FORMAT(update_time, '%Y年%m') time`, `COUNT(*) count`])
      .where('status=:status', { status: 'publish' })
      .groupBy('time')
      .orderBy('update_time', 'DESC')
      .getRawMany();
  }

  async getArchiveList(time) {
    return await this.postsRepository
      .createQueryBuilder('post')
      .where('status=:status', { status: 'publish' })
      .andWhere(`DATE_FORMAT(update_time, '%Y年%m')=:time`, { time: time })
      .orderBy('update_time', 'DESC')
      .getRawMany();
  }

  remove(id) {
    return removeRecord(id, this.postsRepository);
  }
}
