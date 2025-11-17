import { Test, TestingModule } from '@nestjs/testing';
import { ConsultationRepository } from './consultation-repository';

describe('ConsultationRepository', () => {
  let provider: ConsultationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultationRepository],
    }).compile();

    provider = module.get<ConsultationRepository>(ConsultationRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
