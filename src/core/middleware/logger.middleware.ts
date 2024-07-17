import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    // const userAgent = req.get('user-agent') || '';
    // const userAgent = '';

    // 记录请求日志
    // this.loggerService.log(`Request - Method: ${method}, URL: ${originalUrl}, IP: ${ip}, User-Agent: ${userAgent}`);
    this.loggerService.log(
      `Request - Method: ${method}, URL: ${originalUrl}, IP: ${ip}`,
    );

    // // 缓存原始的 res.send 方法
    // const originalSend = res.send.bind(res) as Response['send'];
    //
    // // 重写 res.send 方法，以便记录响应日志
    // res.send = ((body?: any): Response<any, Record<string, any>> => {
    //   this.loggerService.log(
    //     `Response - send - Method: ${method}, URL: ${originalUrl}, IP: ${ip}, User-Agent: ${userAgent}, Body: ${JSON.stringify(
    //       body,
    //     )}`,
    //   );
    //   return originalSend(body);
    // }) as Response['send'];

    // 缓存原始的 res.json 方法
    const originalJson = res.json.bind(res) as Response['json'];

    // 重写 res.json 方法，以便记录响应日志
    res.json = ((body?: any): Response<any, Record<string, any>> => {
      this.loggerService.log(
        `Response - Method: ${method}, URL: ${originalUrl}, IP: ${ip}, Body: ${JSON.stringify(
          body,
        )}`,
      );
      return originalJson(body);
    }) as Response['json'];

    // // 缓存原始的 res.end 方法
    // const originalEnd = res.end.bind(res) as Response['end'];
    //
    // // 重写 res.end 方法，以便记录响应日志
    // res.end = ((data?: any, encoding?: BufferEncoding): void => {
    //   this.loggerService.log(
    //     `Response - red - Method: ${method}, URL: ${originalUrl}, IP: ${ip}, User-Agent: ${userAgent}, Body: ${data}`,
    //   );
    //   originalEnd(data, encoding);
    // }) as Response['end'];

    // 缓存原始的 next 方法
    const originalNext = next.bind(res) as NextFunction;

    // 重写 next 方法，以便捕获并记录错误日志
    next = ((error?: any): void => {
      if (error) {
        this.loggerService.error(
          `Error - Method: ${method}, URL: ${originalUrl}, IP: ${ip}, Error: ${error.message}`,
          error.stack,
        );
      }
      originalNext(error);
    }) as NextFunction;

    // 继续处理请求
    originalNext();
    // next()
  }
}
