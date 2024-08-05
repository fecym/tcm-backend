import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BudgetEntity } from './entities/budget.entity';
import { genLikeWhereConditions, removeRecord } from '../utils';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(BudgetEntity)
    private budgetRepository: Repository<BudgetEntity>,
  ) {}
  async create(createBudgetDto: CreateBudgetDto, user: any) {
    const { name } = createBudgetDto;
    const existBudget = await this.budgetRepository.findOne({
      where: { name },
    });
    if (existBudget) {
      throw new HttpException('预算已存在', HttpStatus.BAD_REQUEST);
    }
    const body = { ...createBudgetDto, user };
    const newBudget = this.budgetRepository.create(body);
    return this.budgetRepository.save(newBudget);
  }

  findAll(query: Record<string, any>, user: { id: any }) {
    const qb = this.budgetRepository
      .createQueryBuilder('budget')
      // 使用 innerJoin 不会返回用户信息
      .innerJoin('budget.user', 'user')
      .where('user.id = :userId', { userId: user.id })
      .orderBy('budget.create_time', 'DESC');
    genLikeWhereConditions(qb, query, 'budget', ['name']);
    return qb.getMany();
  }

  findOne(id: string) {
    return this.budgetRepository.findOne({ where: { id } });
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto) {
    const existBudget = await this.findOne(id);
    console.log(existBudget, 'existBudget');
    if (!existBudget) {
      throw new HttpException(`该记录不存在`, HttpStatus.NOT_FOUND);
    }
    const updateBudget = this.budgetRepository.merge(
      existBudget,
      updateBudgetDto,
    );
    return this.budgetRepository.save(updateBudget);
  }

  remove(id: string) {
    return removeRecord(id, this.budgetRepository);
  }
}
