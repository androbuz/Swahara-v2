import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsRepository } from './analytics-repository';

describe('AnalyticsRepository', () => {
  let provider: AnalyticsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsRepository],
    }).compile();

    provider = module.get<AnalyticsRepository>(AnalyticsRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
