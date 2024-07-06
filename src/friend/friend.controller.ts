import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateTimeInterceptor } from '../core/interceptor/create-time.interceptor';
import { QueryFriendDto } from './dto/query-frient.dto';
import { Roles, RolesGuard } from '../auth/role.guard';

@ApiTags('朋友')
@Controller('friend')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(CreateTimeInterceptor)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({ summary: '新增朋友' })
  @Post()
  create(@Body() createFriendDto: CreateFriendDto, @Req() req) {
    return this.friendService.create(createFriendDto, req.user);
  }

  @ApiOperation({ summary: '查找所有朋友' })
  @Get()
  findAll(@Query() query: QueryFriendDto, @Req() req) {
    return this.friendService.findAll(query, req.user);
  }

  @ApiOperation({ summary: '查看朋友信息' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.friendService.findOne(id);
  }

  @ApiOperation({ summary: '根据Id查询朋友' })
  @Get('/ids')
  findByIds(@Query('ids') ids: string) {
    const idArray = ids.split(',');
    return this.friendService.findByIds(idArray);
  }

  @ApiOperation({ summary: '更新朋友信息' })
  @Post(':id')
  update(@Param('id') id: string, @Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.update(id, updateFriendDto);
  }

  @ApiOperation({ summary: '删除朋友' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(id);
  }
}
