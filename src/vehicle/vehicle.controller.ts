import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/role.guard';
import { QueryPageVehicleDto, QueryVehicleDto } from './dto/query-vehicle.dot';
import { CreateTimeInterceptor } from '../core/interceptor/create-time.interceptor';

@ApiTags('车辆管理')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '4')
@Controller('vehicle')
@UseInterceptors(CreateTimeInterceptor)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiOperation({ summary: '创建车辆' })
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto, @Req() req) {
    return this.vehicleService.create(createVehicleDto, req.user);
  }

  @ApiOperation({ summary: '获取车辆列表' })
  @Get()
  findAll(@Query() query: QueryVehicleDto, @Req() req) {
    return this.vehicleService.findAll(query, req.user);
  }

  @ApiOperation({ summary: '分页查询车辆' })
  @Get('page')
  findPage(@Query() query: QueryPageVehicleDto, @Req() req) {
    return this.vehicleService.findPage(query, req.user);
  }

  @ApiOperation({ summary: '根据ID获取车辆信息' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @ApiOperation({ summary: '更新车辆信息' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @ApiOperation({ summary: '删除车辆' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
