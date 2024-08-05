import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
  Put,
  Req,
} from '@nestjs/common';
import { VehicleMaintainService } from './vehicle-maintain.service';
import { CreateVehicleMaintainDto } from './dto/create-vehicle-maintain.dto';
import { UpdateVehicleMaintainDto } from './dto/update-vehicle-maintain.dto';
import { CreateTimeInterceptor } from '../core/interceptor/create-time.interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/role.guard';
import { QueryVehicleMaintainDto } from './dto/query-vehicle-maintain.dto';
import { QueryPageVehicleDto } from '../vehicle/dto/query-vehicle.dot';

@ApiTags('车辆维修工单')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '3', '4')
@Controller('vehicle-maintain')
@UseInterceptors(CreateTimeInterceptor)
export class VehicleMaintainController {
  constructor(
    private readonly vehicleMaintainService: VehicleMaintainService,
  ) {}

  @ApiOperation({ summary: '创建维修工单' })
  @Post()
  create(
    @Req() req: any,
    @Body() createVehicleMaintainDto: CreateVehicleMaintainDto,
  ) {
    return this.vehicleMaintainService.create(
      req.user,
      createVehicleMaintainDto,
    );
  }

  @ApiOperation({ summary: '获取维系工单列表' })
  @Get()
  findAll(@Query() query: QueryVehicleMaintainDto, @Req() req: any) {
    return this.vehicleMaintainService.findAll(query, req.user);
  }

  @ApiOperation({ summary: '分页查询车辆' })
  @Get('page')
  findPage(@Query() query: QueryPageVehicleDto, @Req() req: any) {
    return this.vehicleMaintainService.findPage(query, req.user);
  }

  @ApiOperation({ summary: '查询车辆维系次数' })
  @Get('count/:id')
  getCountByVehicleId(@Param('id') id: string) {
    return this.vehicleMaintainService.getCountByVehicleId(id);
  }

  @ApiOperation({ summary: '查询车辆最近一次维系情况' })
  @Get('last/:id')
  getLastByVehicleId(@Param('id') id: string) {
    return this.vehicleMaintainService.getLastByVehicleId(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleMaintainService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateVehicleMaintainDto: UpdateVehicleMaintainDto,
  ) {
    return this.vehicleMaintainService.update(id, updateVehicleMaintainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleMaintainService.remove(id);
  }
}
