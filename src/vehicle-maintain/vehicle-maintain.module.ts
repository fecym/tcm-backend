import { Module } from '@nestjs/common';
import { VehicleMaintainService } from './vehicle-maintain.service';
import { VehicleMaintainController } from './vehicle-maintain.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from '../vehicle/entities/vehicle.entity';
import { VehicleMaintainEntity } from './entities/vehicle-maintain.entity';
import { AuthModule } from '../auth/auth.module';
import { VehicleModule } from '../vehicle/vehicle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleMaintainEntity, VehicleEntity]),
    VehicleModule,
    AuthModule,
  ],
  controllers: [VehicleMaintainController],
  providers: [VehicleMaintainService],
})
export class VehicleMaintainModule {}
