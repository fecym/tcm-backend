import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entities/vehicle.entity';
import { AuthModule } from '../auth/auth.module';

// import { VehicleMaintainEntity } from '../vehicle-maintain/entities/vehicle-maintain.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity]), AuthModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}
