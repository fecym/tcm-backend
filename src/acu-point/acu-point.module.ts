import { Module } from '@nestjs/common';
import { AcuPointService } from './acu-point.service';
import { AcuPointController } from './acu-point.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeridianModule } from '../meridian/meridian.module';
import { AuthModule } from '../auth/auth.module';
import { AcuPointEntity } from './entities/acu-point.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AcuPointEntity]),
    MeridianModule,
    AuthModule,
  ],
  controllers: [AcuPointController],
  providers: [AcuPointService],
})
export class AcuPointModule {}
