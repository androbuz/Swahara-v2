import { Test, TestingModule } from '@nestjs/testing';
import { PrescriptionMedicationRepository } from './prescription-medication-repository';

describe('PrescriptionMedicationRepository', () => {
  let provider: PrescriptionMedicationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrescriptionMedicationRepository],
    }).compile();

    provider = module.get<PrescriptionMedicationRepository>(
      PrescriptionMedicationRepository,
    );
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
