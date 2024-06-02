import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MeridianService } from './meridian.service';
import { CreateMeridianDto } from './dto/create-meridian.dto';
import { UpdateMeridianDto } from './dto/update-meridian.dto';
import { QueryMeridianDto } from './dto/query-meridian.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';
import { CreateTimeInterceptor } from '../core/interceptor/create-time.interceptor';
import { SelectDto, transformSelect } from '../dto/select.dto';

@ApiTags('十二正经和奇经八脉')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '2')
@Controller('meridian')
@UseInterceptors(CreateTimeInterceptor)
export class MeridianController {
  constructor(private readonly meridianService: MeridianService) {}

  @ApiOperation({ summary: '创建' })
  @Post()
  create(@Body() createMeridianDto: CreateMeridianDto) {
    return this.meridianService.create(createMeridianDto);
  }

  @ApiOperation({ summary: '下拉' })
  @Get('select')
  async findSelect(@Query() query: QueryMeridianDto): Promise<SelectDto[]> {
    const entities = await this.meridianService.findAll(query);
    return entities.map((entity) => transformSelect(entity));
  }

  @ApiOperation({ summary: '列表' })
  @Get('list')
  findAll(@Query() query: QueryMeridianDto) {
    return this.meridianService.findAll(query);
  }

  @ApiOperation({ summary: '查询详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meridianService.findOne(id);
  }

  @ApiOperation({ summary: '更新' })
  @Roles('1')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeridianDto: UpdateMeridianDto,
  ) {
    return this.meridianService.update(id, updateMeridianDto);
  }

  @ApiOperation({ summary: '删除' })
  @Roles('1')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meridianService.remove(id);
  }
}
