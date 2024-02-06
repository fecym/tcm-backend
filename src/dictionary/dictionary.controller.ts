import { Controller, Get } from '@nestjs/common';
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
}
