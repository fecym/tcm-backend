import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AcuPointService } from './acu-point.service';
import { CreateAcuPointDto } from './dto/create-acu-point.dto';
import { UpdateAcuPointDto } from './dto/update-acu-point.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles, RolesGuard } from '../auth/role.guard';

@ApiTags('穴位')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('1', '2', '4')
@Controller('acu-point')
export class AcuPointController {
  constructor(private readonly acuPointService: AcuPointService) {}

  @Post()
  create(@Body() createAcuPointDto: CreateAcuPointDto) {
    return this.acuPointService.create(createAcuPointDto);
  }

  @Get()
  findAll() {
    return this.acuPointService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.acuPointService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAcuPointDto: UpdateAcuPointDto,
  ) {
    return this.acuPointService.update(id, updateAcuPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.acuPointService.remove(id);
  }
}
