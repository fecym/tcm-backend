import { Module } from '@nestjs/common';
import { HerbsService } from './herbs.service';
import { HerbsController } from './herbs.controller';
import { HerbEntity } from './entities/herb.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MeridianModule } from '../meridian/meridian.module';

@Module({
  imports: [TypeOrmModule.forFeature([HerbEntity]), MeridianModule, AuthModule],
  controllers: [HerbsController],
  providers: [HerbsService],
})
export class HerbsModule {}
