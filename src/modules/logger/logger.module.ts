import { Module } from '@nestjs/common';
import { PinoLoggerService } from './services/pino-logger/pino-logger.service';

@Module({
  providers: [PinoLoggerService]
})
export class LoggerModule {}
