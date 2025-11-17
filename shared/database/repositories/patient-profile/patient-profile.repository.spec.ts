import { Test, TestingModule } from '@nestjs/testing';
import { PatientProfileRepository } from './patient-profile.repository';

describe('PatientProfileRepository', () => {
  let provider: PatientProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientProfileRepository],
    }).compile();

    provider = module.get<PatientProfileRepository>(PatientProfileRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
