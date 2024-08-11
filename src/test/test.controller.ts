import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  Req, Delete
} from "@nestjs/common";
import { TestService } from './test.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/role.guard';
import { CreateTimeInterceptor } from '../core/interceptor/create-time.interceptor';

@ApiTags('测试用-误点')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(CreateTimeInterceptor)
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({ summary: '批量添加随机消费数据' })
  @Post('expense')
  batchInsertExpense(@Req() req: any) {
    return this.testService.batchInsertExpense(req.user);
  }

  @ApiOperation({ summary: '批量添加随机转账数据' })
  @Post('transfer')
  batchInsertTransfer(@Req() req: any) {
    return this.testService.batchInsertTransfer(req.user);
  }

  @ApiOperation({ summary: '删除所有转账数据' })
  @Delete('deleteAll/transfer')
  deleteAllTransfer(@Req() req: any) {
    return this.testService.deleteAllTransfer(req.user);
  }
}
