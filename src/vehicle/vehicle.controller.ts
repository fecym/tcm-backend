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
@UseGuards(AuthGuard('jwt'))
@Controller('vehicle')
@UseInterceptors(CreateTimeInterceptor)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @ApiOperation({ summary: '创建车辆' })
  @Roles('1', '4')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.create(createVehicleDto);
  }

  @ApiOperation({ summary: '获取车辆列表' })
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query() query: QueryVehicleDto) {
    return this.vehicleService.findAll(query);
  }

  @ApiOperation({ summary: '分页查询车辆' })
  @UseGuards(AuthGuard('jwt'))
  @Get('page')
  findPage(@Query() query: QueryPageVehicleDto) {
    return this.vehicleService.findPage(query);
  }

  @ApiOperation({ summary: '根据ID获取车辆信息' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleService.findOne(id);
  }

  @ApiOperation({ summary: '更新车辆信息' })
  @ApiBearerAuth()
  @Roles('1', '4')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.update(id, updateVehicleDto);
  }

  @ApiOperation({ summary: '删除车辆' })
  @ApiBearerAuth()
  @Roles('1', '4')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleService.remove(id);
  }
}
