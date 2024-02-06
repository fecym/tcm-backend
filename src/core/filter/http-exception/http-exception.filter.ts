import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { getDuplicateName } from '../../../utils';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取请求上下文
    const response = ctx.getResponse(); // 获取请求上下文中的 response对象
    const status = exception.getStatus?.(); // 获取异常状态码
    const exceptionResponse: any = exception.getResponse?.();
    let validMessage = '';

    if (typeof exceptionResponse === 'object') {
      validMessage =
        typeof exceptionResponse.message === 'string'
          ? exceptionResponse.message
          : exceptionResponse.message?.[0];
    }
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    let errorMsg = validMessage || message;

    errorMsg = errorMsg.includes('Duplicate entry ')
      ? `${getDuplicateName(errorMsg) || '数据'} 已存在`
      : validMessage || message;

    const errorResponse = {
      data: {},
      message: errorMsg,
      code: -1,
    };

    // 设置返回的状态码， 请求头，发送错误信息
    response.status(status ?? 500);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
