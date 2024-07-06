import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/role.guard';
import { QueryExpenseDto, QueryPageExpenseDto } from './dto/query-expense.dto';
import { QueryDateRangeDto } from '../dto/date.dto';

@ApiTags('消费记录')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '4')
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @ApiOperation({ summary: '创建消费记录' })
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Req() req) {
    return this.expenseService.create(createExpenseDto, req.user);
  }

  @ApiOperation({ summary: '查找所有消费记录' })
  @Get()
  findAll(@Query() query: QueryExpenseDto, @Req() req) {
    return this.expenseService.findAll(query, req.user);
  }

  @ApiOperation({ summary: '分页查找消费记录' })
  @Get('/page')
  findPage(@Query() query: QueryPageExpenseDto, @Req() req) {
    return this.expenseService.findPage(query, req.user);
  }

  @ApiOperation({ summary: '按月分组查找消费记录' })
  @Get('/list/date')
  getGroupedByDay(@Query() query: QueryDateRangeDto, @Req() req) {
    return this.expenseService.getGroupedByDay(query, req.user);
  }

  @ApiOperation({ summary: '查询消费记录详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @ApiOperation({ summary: '更新消费记录' })
  @Post(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @ApiOperation({ summary: '删除消费记录' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
