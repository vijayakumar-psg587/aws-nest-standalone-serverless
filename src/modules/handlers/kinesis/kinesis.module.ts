import { Module } from '@nestjs/common';
import { GenericConsumerService } from './services/generic-consumer/generic-consumer.service';

@Module({
  providers: [GenericConsumerService]
})
export class KinesisModule {}
