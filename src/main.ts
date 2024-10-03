import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { TrimEmptyStringsPipe } from './core/pipes/trim-empty-strings.pipe';
// import { LoggerMiddleware } from './core/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api'); // 设置全局路由前缀
  // 注册全局过滤器拦截器
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new TrimEmptyStringsPipe(),
    new ValidationPipe({
      transform: true, // 启用转换
      // whitelist: true, // 自动剥离 DTO 中未定义的属性
      // forbidNonWhitelisted: true, // 禁止传入未定义的属性
      transformOptions: {
        // enableImplicitConversion: true,
      },
    }),
  );

  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  const port = configService.get('PORT');

  await app.listen(port);
}

bootstrap();
