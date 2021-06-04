import { Expose } from 'class-transformer';

interface IErrorResponse {
	code: string;
	status: number;
	timestamp: string;
	message: string | Record<string, unknown>;
}

export class CustomErrorModel {
	@Expose()
	code: string;
	@Expose()
	message: string | Record<string, unknown>;
	@Expose()
	status: number;
	@Expose()
	timestamp: string;

	constructor(error: IErrorResponse) {
		this.code = error.code;
		this.message = error.message;
		this.status = error.status;
		this.timestamp = error.timestamp;
	}
}
