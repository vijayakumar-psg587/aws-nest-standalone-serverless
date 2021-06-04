import { Injectable, Scope, Inject } from '@nestjs/common';
import { loggingDecorator } from './../../../../common/decorators/logging.decorator';
import { REQUEST } from '@nestjs/core';
import { Context } from 'vm';

@Injectable({ scope: Scope.REQUEST })
export class GenericConsumerService {
	constructor(@Inject(REQUEST) private readonly reqId: Context) {}

	@loggingDecorator('test')
	public async consumerService(): Promise<any> {
		return Promise.resolve('Consumed message');
	}
}
