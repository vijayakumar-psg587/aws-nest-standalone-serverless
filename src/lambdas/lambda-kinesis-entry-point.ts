import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';
import * as appDeclare from '../main';
import { ContextIdFactory } from '@nestjs/core';
import { KinesisModule } from '../modules/handlers/kinesis/kinesis.module';
import { GenericConsumerService } from '../modules/handlers/kinesis/services/generic-consumer/generic-consumer.service';
import { CustomErrorModel } from '../modules/common/models/exception/custom-error.model';
import { AppConfigService } from '../modules/common/services/app-config/app-config.service';
export async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
	try {
		const app = await appDeclare.bootstrap();
		// this is to have a unique contextId for tracking purposes
		const contextId = ContextIdFactory.create();
		app.registerRequestByContextId({ context }, contextId);

		const pathParams = event.pathParameters;
		const queryParams = event.queryStringParameters;
		const body = event.body ? JSON.stringify(event.body) : '';
		console.log('path params:', pathParams);
		console.log('queryParams:', queryParams);
		console.log('body:', body);

		try {
			// now just execute the method and stop
			const kinesisService = await app.select(KinesisModule).resolve(GenericConsumerService);
			const result = await kinesisService.consumerService();
			console.log('result obtained:', result);

			return { statusCode: 201, body: JSON.stringify(AppConfigService.createGenericResponse(result)) };
		} catch (err) {
			console.log('err in processing');
			if (err instanceof CustomErrorModel) {
				return { statusCode: 500, body: JSON.stringify(err) };
			} else {
				return { statusCode: 500, body: JSON.stringify(err.message) };
			}
		}
	} catch (err) {
		console.log('app intialization err:', err);
		return { statusCode: 500, body: JSON.stringify(err.message) };
	}
}
