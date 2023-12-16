import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { transformDateTime } from '../utils';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${transformDateTime(timestamp)} [${level.toUpperCase()}]: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), logFormat),
  transports: [
    // new winston.transports.Console(),
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
}
