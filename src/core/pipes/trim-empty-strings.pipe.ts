import {
  Injectable,
  PipeTransform,
  Logger,
  ArgumentMetadata,
} from '@nestjs/common';

@Injectable()
export class TrimEmptyStringsPipe implements PipeTransform {
  private readonly logger = new Logger(TrimEmptyStringsPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.debug(`Before TrimEmptyStringsPipe: ${JSON.stringify(value)}`);
    if (metadata.type === 'query') {
      const transformed = this.recursiveTrim(value);
      this.logger.debug(
        `After TrimEmptyStringsPipe: ${JSON.stringify(transformed)}`,
      );
      return transformed;
    }
    return value;
  }

  private recursiveTrim(obj: any): any {
    if (typeof obj === 'string') {
      return obj.trim() === '' ? undefined : obj;
    } else if (Array.isArray(obj)) {
      return obj.map((item) => this.recursiveTrim(item));
    } else if (obj !== null && typeof obj === 'object') {
      const trimmedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          trimmedObj[key] = this.recursiveTrim(obj[key]);
        }
      }
      return trimmedObj;
    }
    return obj;
  }
}
