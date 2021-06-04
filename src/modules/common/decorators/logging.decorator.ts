import { HttpStatus } from '@nestjs/common';
import { AppUtilService } from './../services/app-util/app-util.service';
import { AppConfigService } from '../services/app-config/app-config.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const performance = require('performance-now');
import { Context } from 'aws-lambda';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const loggingDecorator = (reqId: string) => (target: any, property: string, descriptor: PropertyDescriptor) => {
	const originalMethod = descriptor.value;

	descriptor.value = new Proxy(originalMethod, {
		apply: async function(target, thisArgs, args) {
			const infoLogger = AppUtilService.getLogger('info', reqId, property);
			const errorLogger = AppUtilService.getLogger('error', reqId, property);

			let startTime;
			let endTime;
			try {
				infoLogger.info('Executing service with args:' + args);
				startTime = performance();
				const result = target.apply(thisArgs, ...args);
				endTime = performance();
				infoLogger.info('Completed execution for the service in' + (endTime - startTime));
				return result;
			} catch (err) {
				errorLogger.error(`Error in executing the method: ${err.message}`);
				AppConfigService.setAndThrowException(HttpStatus.INTERNAL_SERVER_ERROR, 'SERVER', 'Error executing method' + err.message, AppUtilService.getDefaultUTCTime());
			}
		},
	});
};
