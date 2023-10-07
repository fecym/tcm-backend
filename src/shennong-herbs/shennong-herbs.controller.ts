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
import { ShennongHerbsService } from './shennong-herbs.service';
import { CreateShennongHerbDto } from './dto/create-shennong-herb.dto';
import { UpdateShennongHerbDto } from './dto/update-shennong-herb.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';
import {
  QueryPageShennongHerbDto,
  QueryShennongHerbDto,
} from './dto/query-shennong-herb.dto';

@ApiTags('神农本草经')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('shennong-herbs')
export class ShennongHerbsController {
  constructor(private readonly shennongHerbsService: ShennongHerbsService) {}

  @ApiOperation({ summary: '添加本草' })
  @Roles('admin', 'root', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createShennongHerbDto: CreateShennongHerbDto, @Req() req) {
    return this.shennongHerbsService.create(req.user, createShennongHerbDto);
  }

  @ApiOperation({ summary: '查询所有本草' })
  @Get('list')
  findAll(@Query() query: QueryShennongHerbDto) {
    return this.shennongHerbsService.findAll(query);
  }

  @ApiOperation({ summary: '分页查询本草' })
  @Get('page')
  findPage(@Query() query: QueryPageShennongHerbDto) {
    return this.shennongHerbsService.findPage(query);
  }

  @ApiOperation({ summary: '查看本草详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shennongHerbsService.findOne(id);
  }

  @ApiOperation({ summary: '编辑本草' })
  @Roles('admin', 'root', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateShennongHerbDto: UpdateShennongHerbDto,
    @Req() req,
  ) {
    return this.shennongHerbsService.update(
      +id,
      updateShennongHerbDto,
      req.user,
    );
  }

  @ApiOperation({ summary: '删除本草' })
  @Roles('admin', 'root', 'author')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shennongHerbsService.remove(+id);
  }
}
