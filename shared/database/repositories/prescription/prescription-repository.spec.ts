import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionRepository } from './prescription-repository';

describe('PrescriptionRepository', () => {
  let provider: PrescriptionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionRepository],
    }).compile();

    provider = module.get<PrescriptionRepository>(PrescriptionRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
