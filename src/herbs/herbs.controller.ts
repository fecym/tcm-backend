import {
  Controller,
  Query,
  Req,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { HerbsService } from './herbs.service';
import { CreateHerbDto } from './dto/create-herb.dto';
import { UpdateHerbDto } from './dto/update-herb.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';
import { QueryPageHerbDto, QueryHerbDto } from './dto/query-herb.dto';

@ApiTags('神农本草经')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '2')
@Controller('herbs')
export class HerbsController {
  constructor(private readonly herbsService: HerbsService) {}

  @ApiOperation({ summary: '添加本草' })
  @Post()
  create(@Body() createHerbDto: CreateHerbDto, @Req() req) {
    return this.herbsService.create(req.user, createHerbDto);
  }

  @ApiOperation({ summary: '查询所有本草' })
  @Get('list')
  findAll(@Query() query: QueryHerbDto) {
    return this.herbsService.findAll(query);
  }

  @ApiOperation({ summary: '分页查询本草' })
  @Get('page')
  findPage(@Query() query: QueryPageHerbDto) {
    return this.herbsService.findPage(query);
  }

  @ApiOperation({ summary: '查看本草详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.herbsService.findOne(id);
  }

  @ApiOperation({ summary: '编辑本草' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateHerbDto: UpdateHerbDto,
    @Req() req,
  ) {
    return this.herbsService.update(id, updateHerbDto, req.user);
  }

  @ApiOperation({ summary: '删除本草' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.herbsService.remove(id);
  }
}
