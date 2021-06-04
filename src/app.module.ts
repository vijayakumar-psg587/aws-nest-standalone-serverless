import { Module } from '@nestjs/common';
import { KinesisModule } from './modules/handlers/kinesis/kinesis.module';
import { LoggerModule } from './modules/logger/logger.module';
import { SqsModule } from './modules/handlers/sqs/sqs.module';
import { AppUtilService } from './modules/common/services/app-util/app-util.service';
import { AppConfigService } from './modules/common/services/app-config/app-config.service';

@Module({
	imports: [KinesisModule, LoggerModule, SqsModule],
	providers: [AppUtilService, AppConfigService],
})
export class AppModule {}
