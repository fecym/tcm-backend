import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// @nestjs/config依赖于dotenv，可以通过key=value形式配置环境变量，项目会默认加载根目录下的.env文件，我们只需在app.module.ts中引入ConfigModule，使用ConfigModule.forRoot()方法即可，然后ConfigService读取相关的配置变量。
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig, { isProd } from '../config/env';
// import { PostsEntity } from './posts/posts.entity';
import { UserModule } from './user/user.module';
import { HerbsModule } from './herbs/herbs.module';
import { AuthModule } from './auth/auth.module';
import { MeridianModule } from './meridian/meridian.module';
import { TagModule } from './tag/tag.module';
import { CategoryModule } from './category/category.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { LoggerMiddleware } from './core/middleware/logger.middleware';
import { LoggerModule } from './logger/logger.module';
import { AcuPointModule } from './acu-point/acu-point.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { VehicleMaintainModule } from './vehicle-maintain/vehicle-maintain.module';
import { LunarController } from './lunar/lunar.controller';
import { LunarService } from './lunar/lunar.service';
import { ExpenseModule } from './expense/expense.module';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        // entities: [PostsEntity], // 数据表实体
        autoLoadEntities: true,
        host: configService.get('DB_HOST', 'localhost'), // 主机，默认为localhost
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWD', '1314asd.'), // 密码
        database: configService.get('DB_DATABASE', 'tcm_dev'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        // 空数据库，随便折腾，数据库中有数据时， 建议一定要谨慎点，建议关闭
        synchronize: !isProd, //根据实体自动创建数据库表， 生产环境建议关闭
        logging: !isProd,
      }),
    }),
    AuthModule,
    UserModule,
    PostsModule,
    HerbsModule,
    MeridianModule,
    TagModule,
    CategoryModule,
    DictionaryModule,
    LoggerModule,
    AcuPointModule,
    VehicleModule,
    VehicleMaintainModule,
    ExpenseModule,
    FriendModule,
  ],
  controllers: [AppController, LunarController],
  providers: [AppService, LunarService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
