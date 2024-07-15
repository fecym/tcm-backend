import { Controller, Get, Query } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('字典')
@Controller('dict')
export class DictionaryController {
  constructor(private readonly dictionaryService: DictionaryService) {}

  @ApiOperation({ summary: '味' })
  @Get('taste')
  getTaste() {
    return this.dictionaryService.getTaste();
  }

  @ApiOperation({ summary: '性' })
  @Get('nature')
  getNature() {
    return this.dictionaryService.getNature();
  }

  @ApiOperation({ summary: '毒' })
  @Get('toxic')
  getToxic() {
    return this.dictionaryService.getToxic();
  }

  @ApiOperation({ summary: '神农本草经分类' })
  @Get('category')
  getCategory() {
    return this.dictionaryService.getCategory();
  }

  @ApiOperation({ summary: '用户角色' })
  @Get('/user/role')
  getUserRole() {
    return this.dictionaryService.getUserRole();
  }

  @ApiOperation({ summary: '性别' })
  @Get('/gender')
  getGender() {
    return this.dictionaryService.getGender();
  }

  @ApiOperation({ summary: '朋友关系' })
  @Get('/friend/relationship')
  getUserGender() {
    return this.dictionaryService.getFriendRelationship();
  }

  @ApiOperation({ summary: '支付类型' })
  @Get('/pay-type')
  getPayType() {
    return this.dictionaryService.getPayType();
  }

  @ApiOperation({ summary: '消费类型' })
  @Get('/expense-type')
  getExpenseType() {
    return this.dictionaryService.getExpenseType();
  }

  @ApiOperation({ summary: '消费类型' })
  @Get('/date-interval')
  getDateInterval() {
    return this.dictionaryService.getDateInterval();
  }

  @ApiOperation({ summary: '转账方式' })
  @Get('/transfer-mode')
  getTransferMode() {
    return this.dictionaryService.getPayType();
  }

  @ApiOperation({ summary: '转账类型' })
  @Get('/transfer-type')
  getTransferType(@Query() query: { type: string | number }) {
    return this.dictionaryService.getTransferType(query);
  }
}
