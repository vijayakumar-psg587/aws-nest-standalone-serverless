import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import { ContextIdFactory } from '@nestjs/core';
// import { AppUtilService } from './modules/common/services/app-util/app-util.service';
import { KinesisModule } from './modules/handlers/kinesis/kinesis.module';
import { GenericConsumerService } from './modules/handlers/kinesis/services/generic-consumer/generic-consumer.service';
import { AppConfigService } from './modules/common/services/app-config/app-config.service';
import { CustomErrorModel } from './modules/common/models/exception/custom-error.model';

export async function bootstrap(): Promise<any> {
	const app = await NestFactory.createApplicationContext(AppModule);
	// // All service calls in between
	// console.log(AppUtilService.getDefaultUTCTime());
	// try {
	// 	const consumerService = await app.select(KinesisModule).resolve(GenericConsumerService);
	// 	const res = await consumerService.consumerService();
	// 	console.log('resp is:', res);
	// 	await app.close();
	// } catch (err) {
	// 	console.log('err jere:', err);
	// }

	return app;
}
