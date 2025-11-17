import { Test, TestingModule } from '@nestjs/testing';
import { MedicationRepository } from './medication-repository';

describe('MedicationRepository', () => {
  let provider: MedicationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationRepository],
    }).compile();

    provider = module.get<MedicationRepository>(MedicationRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
