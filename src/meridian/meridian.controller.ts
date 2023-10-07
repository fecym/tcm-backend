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
} from '@nestjs/common';
import { MeridianService } from './meridian.service';
import { CreateMeridianDto } from './dto/create-meridian.dto';
import { UpdateMeridianDto } from './dto/update-meridian.dto';
import { QueryMeridianDto } from './dto/query-meridian.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard, Roles } from '../auth/role.guard';

@ApiTags('十二正经和奇经八脉')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('meridian')
export class MeridianController {
  constructor(private readonly meridianService: MeridianService) {}

  @ApiOperation({ summary: '创建' })
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createMeridianDto: CreateMeridianDto) {
    return this.meridianService.create(createMeridianDto);
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
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeridianDto: UpdateMeridianDto,
  ) {
    return this.meridianService.update(+id, updateMeridianDto);
  }

  @ApiOperation({ summary: '删除' })
  @Roles('admin', 'root')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meridianService.remove(+id);
  }
}
