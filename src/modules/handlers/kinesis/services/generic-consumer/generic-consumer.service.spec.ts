import { Test, TestingModule } from '@nestjs/testing';
import { GenericConsumerService } from './generic-consumer.service';

describe('GenericConsumerService', () => {
  let service: GenericConsumerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GenericConsumerService],
    }).compile();

    service = module.get<GenericConsumerService>(GenericConsumerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
