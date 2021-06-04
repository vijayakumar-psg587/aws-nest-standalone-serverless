import { Injectable } from '@nestjs/common';
import * as pino from 'pino';
import * as os from 'os';
import { APP_CONST } from './../../../../modules/common/util/app.constant';
import { AppUtilService } from './../../../../modules/common/services/app-util/app-util.service';
@Injectable()
export class PinoLoggerService {
	/**
	 * This static service defines pino logger with dynamic option loggin
	 * The destination stream here would be either stderr or stdout based on type of log
	 * Pretty print is enabled only for dev environment
	 * @param logLevel
	 * @param destStream
	 * @param context
	 * @param redactObj
	 * @returns
	 */
	static fetchCustomizedLogger(logLevel: pino.Level, destStream: unknown, reqId: string, name?: string): pino.Logger {
		const opts = {
			messageKey: APP_CONST.COMMON.DEFAULT_LOG_KEY,
			logLevel: logLevel,
			base: {
				hostName: os.hostname(),
				platform: os.platform(),
				processId: process.pid,
				timestamp: AppUtilService.getDefaultUTCTime(),
				reqId: reqId,
				// tslint:disable-next-line: object-literal-sort-keys
				fileName: name,
			},
			prettyPrint: AppUtilService.isDev(process.env.NODE_ENV),
		};

		return pino(opts, pino.destination(destStream));
	}
}
