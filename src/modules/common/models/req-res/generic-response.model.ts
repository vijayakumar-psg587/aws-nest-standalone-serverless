import { Expose } from 'class-transformer';

export class GenericResponseModel {
	@Expose()
	metdata: Record<string, unknown>;

	@Expose()
	result: Record<string, unknown>[];
}
