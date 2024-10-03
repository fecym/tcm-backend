import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { transformDateTime } from '../utils';

// const logFormat = winston.format.printf(({ level, message, timestamp }) => {
//   return `${transformDateTime(timestamp)} [${level.toUpperCase()}]: ${message}`;
// });

const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    let logMessage = `${transformDateTime(
      timestamp,
    )} [${level.toUpperCase()}]: ${message}`;
    if (stack) {
      logMessage += `\n${stack}`;
    }
    return logMessage;
  },
);

const logger = winston.createLogger({
  level: 'debug', // 设置日志级别为 debug
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

@Injectable()
export class LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string, trace: string) {
    logger.error(`${message} \n ${trace}`);
  }

  warn(message: string) {
    logger.warn(message);
  }

  // 记录调试级别的日志
  debug(message: string) {
    logger.debug(message);
  }
}
