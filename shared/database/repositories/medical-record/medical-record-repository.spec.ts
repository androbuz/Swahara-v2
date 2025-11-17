import { Test, TestingModule } from '@nestjs/testing';
import { MedicalRecordRepository } from './medical-record-repository';

describe('MedicalRecordRepository', () => {
  let provider: MedicalRecordRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicalRecordRepository],
    }).compile();

    provider = module.get<MedicalRecordRepository>(MedicalRecordRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
