import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CreateTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const dataWithoutTimeFields = request.body;
    const { method } = request;
    // 新增
    if (method === 'POST') {
      delete dataWithoutTimeFields.id;
      dataWithoutTimeFields.createTime = new Date();
      dataWithoutTimeFields.updateTime = new Date();
    }
    // 编辑
    if (method === 'PUT' || method === 'PATCH') {
      dataWithoutTimeFields.updateTime = new Date();
    }

    request.body = dataWithoutTimeFields;

    return next.handle();
  }
}
