import { Injectable, ValidationError, HttpStatus } from '@nestjs/common';
import { APP_CONST } from '../../util/app.constant';
import { UserIdType } from '../../models/enums/user-type.enum';
import { PrincipalRoleType } from '../../models/enums/principal-role-type.enum';
import { CustomErrorModel } from '../../models/exception/custom-error.model';
import { ErrorTypes } from '../../models/enums/error-type.enum';
import * as dateFns from 'date-fns';
import * as locale from 'date-fns/locale';
import * as os from 'os';
import * as pino from 'pino';
import { PinoLoggerService } from './../../../logger/services/pino-logger/pino-logger.service';

@Injectable()
export class AppUtilService {
	static getDefaultUTCTime(): string {
		return dateFns.format(Date.now(), APP_CONST.COMMON.DEFAULT_DATE_TIME_FORMAT, { locale: locale.enIN });
	}

	/**
	 * This varies for each request, hence setting it via a method
	 * @param trackingId
	 * @param userID
	 * @param principalRole
	 */
	static setAxiosRequestHeaders(trackingId: string, userID: UserIdType, principalRole: PrincipalRoleType): Record<string, unknown> {
		return {
			'FID-APP-NAME': APP_CONST.COMMON.APP_NAME,
			'FID-LOG-TRACKING-ID': trackingId,
			'FID-USER-TYPE': userID,
			'FID-CONSUMER-APP-PROCESS': 'PM' + trackingId,
			'FID-PRINCIPAL-ROLE': principalRole,
		};
	}

	static handleCustomException(errorCode: number, type: string, customMsg: string): CustomErrorModel {
		const customErr = new CustomErrorModel(null);
		if (type === ErrorTypes.VALIDATION) {
			customErr.code = ErrorTypes.VALIDATION;
			customErr.status = 421;
		} else if (type === ErrorTypes.REQ) {
			customErr.code = ErrorTypes.REQ;
			customErr.status = 424;
		} else if (type === ErrorTypes.DB) {
			customErr.code = ErrorTypes.DB;
			customErr.status = 425;
		} else {
			customErr.code = type;
			customErr.status = 500;
		}

		customErr.message = customMsg;
		customErr.timestamp = AppUtilService.getDefaultUTCTime();
		return customErr;
	}

	static customValidationExceptionFactory(errors: ValidationError[]): unknown {
		const customError = new CustomErrorModel(null);
		customError.code = '400';
		customError.timestamp = AppUtilService.getDefaultUTCTime();

		customError.status = HttpStatus.BAD_REQUEST;
		let errMessage = '';
		errors.forEach((err) => {
			errMessage = errMessage === '' ? AppUtilService.getValidationErrorMessage(err) : errMessage.concat(APP_CONST.CHAR.HYPHEN).concat(AppUtilService.getValidationErrorMessage(err));
		});

		console.log('final Error message:', errMessage);
		customError.message = errMessage;
		throw customError;
	}

	static getValidationErrorMessage(err: ValidationError): string {
		let targetName = '';
		if (err && err.target) {
			if (err.target.constructor) {
				targetName = err.target.constructor.name;
			} else {
				targetName = err.target.name;
			}
		}
		return (
			`Validation err for - ${targetName} with property - ${err.property} -value - ${err.value} 
    has the constraints - ${JSON.stringify(err.constraints)}` + os.EOL
		);
	}

	static isDev(prop: string): boolean {
		if (prop && prop.localeCompare('dev')) {
			return true;
		} else {
			return false;
		}
	}

	static getLogger(logLevel: pino.logLevel, contexId: string, name: string): pino.Logger {
		if (logLevel === 'info') {
			return PinoLoggerService.fetchCustomizedLogger(logLevel, process.stdout, contexId, name);
		} else if (logLevel === 'error') {
			return PinoLoggerService.fetchCustomizedLogger(logLevel, process.stderr, contexId, name);
		}
	}
}
