import { Module } from '@nestjs/common';
import { MeridianService } from './meridian.service';
import { MeridianController } from './meridian.controller';
import { MeridianEntity } from './entities/meridian.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([MeridianEntity]), AuthModule],
  controllers: [MeridianController],
  providers: [MeridianService],
  exports: [MeridianService],
})
export class MeridianModule {}
