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
import { TransfersService } from './transfers.service';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/role.guard';
import {
  QueryPageTransferDto,
  QueryTransferDto,
} from './dto/query-transfer.dto';

@ApiTags('转账记录')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '4')
@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @ApiOperation({ summary: '创建转账记录' })
  @Post()
  create(@Body() createTransferDto: CreateTransferDto, @Req() req) {
    return this.transfersService.create(createTransferDto, req.user);
  }

  @ApiOperation({ summary: '查询转账记录' })
  @Get()
  findAll(@Query() query: QueryTransferDto, @Req() req) {
    return this.transfersService.findAll(query, req.user);
  }

  @ApiOperation({ summary: '分页查询转账记录' })
  @Get('page')
  findPage(@Query() query: QueryPageTransferDto, @Req() req) {
    return this.transfersService.findPage(query, req.user);
  }

  @ApiOperation({ summary: '查询转账记录详情' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @ApiOperation({ summary: '编辑转账记录' })
  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransferDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(id, updateTransferDto);
  }

  @ApiOperation({ summary: '删除转账记录' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transfersService.remove(id);
  }
}
