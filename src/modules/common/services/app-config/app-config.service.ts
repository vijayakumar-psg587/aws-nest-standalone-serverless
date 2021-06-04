import { Injectable } from '@nestjs/common';
import { CustomErrorModel } from '../../models/exception/custom-error.model';
import * as os from 'os';
import { GenericResponseModel } from '../../models/req-res/generic-response.model';

@Injectable()
export class AppConfigService {
	static createGenericResponse(resp: string): GenericResponseModel {
		const genericResponseModel = new GenericResponseModel();
		genericResponseModel.metdata = {};
		genericResponseModel.result = [{ resp }];
		return genericResponseModel;
	}

	static fetchPropertyForSimpleObjs(obj: unknown): unknown {
		const arr: string[] = [];

		return typeof obj === 'object'
			? (() => {
					Object.keys(obj).forEach((key) => {
						if (!obj[key]) {
							arr.push(key);
						}
					});
					return arr;
			  })()
			: obj;
	}

	/**
	 * method to list different parameters and their concerned property tested
	 * with the incorrect value passed
	 * @param errString
	 * @param errorItem
	 */
	static createErrorStringsForValidaionError(errString: string, errorItem: unknown) {
		const props = AppConfigService.fetchPropertyForSimpleObjs(errorItem['target']);
		return (
			`ValidationError - ${errorItem['target'].constructor.name}
                with property: "${props}" 
                Value provided: "${errorItem['value']}"` + os.EOL
		);
	}

	/**
	 * This method takes care of creating a custom errorResponse exception and throw to
	 * the global exception filter
	 * @param statusCode
	 * @param error
	 * @param message
	 */
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	static setAndThrowException(status = 500, code = 'SERVER', message: string, timestamp: string) {
		throw new CustomErrorModel({ code, message, status, timestamp });
	}
}
