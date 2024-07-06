import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
  // Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserPageQueryDto } from './dto/user-query.dto';
import { Roles, RolesGuard } from '../auth/role.guard';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '注册用户' })
  @ApiResponse({ status: 201, type: [UserEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  @ApiOperation({ summary: '获取用户列表' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  findAll(@Query() query: UserPageQueryDto) {
    return this.userService.findAll(query);
  }

  @ApiOperation({ summary: '获取用户信息' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getUser(@Req() req) {
    return req.user;
  }

  @ApiOperation({ summary: '根据ID获取用户信息' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: '修改密码' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put()
  updatePassword(@Req() req, @Body() body) {
    return this.userService.updatePassword(req.user.id, body);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiBearerAuth()
  @Roles('0')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
