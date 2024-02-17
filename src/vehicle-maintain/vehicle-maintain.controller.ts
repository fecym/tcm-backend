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
@UseGuards(AuthGuard('jwt'))
@Controller('vehicle-maintain')
@UseInterceptors(CreateTimeInterceptor)
export class VehicleMaintainController {
  constructor(
    private readonly vehicleMaintainService: VehicleMaintainService,
  ) {}

  @ApiOperation({ summary: '创建维修工单' })
  @Roles('1', '3')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(
    @Req() req,
    @Body() createVehicleMaintainDto: CreateVehicleMaintainDto,
  ) {
    return this.vehicleMaintainService.create(
      req.user,
      createVehicleMaintainDto,
    );
  }

  @ApiOperation({ summary: '获取维系工单列表' })
  @Get()
  findAll(@Query() query: QueryVehicleMaintainDto) {
    return this.vehicleMaintainService.findAll(query);
  }

  @ApiOperation({ summary: '分页查询车辆' })
  @UseGuards(AuthGuard('jwt'))
  @Get('page')
  findPage(@Query() query: QueryPageVehicleDto) {
    return this.vehicleMaintainService.findPage(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehicleMaintainService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateVehicleMaintainDto: UpdateVehicleMaintainDto,
  ) {
    return this.vehicleMaintainService.update(
      id,
      req.user,
      updateVehicleMaintainDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehicleMaintainService.remove(id);
  }
}
