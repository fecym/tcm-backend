import { Module } from '@nestjs/common';
import { ShennongHerbsService } from './shennong-herbs.service';
import { ShennongHerbsController } from './shennong-herbs.controller';
import { ShennongHerbEntity } from './entities/shennong-herb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MeridianModule } from '../meridian/meridian.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShennongHerbEntity]),
    MeridianModule,
    AuthModule,
  ],
  controllers: [ShennongHerbsController],
  providers: [ShennongHerbsService],
})
export class ShennongHerbsModule {}
