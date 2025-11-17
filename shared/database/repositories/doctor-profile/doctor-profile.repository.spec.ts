import { Test, TestingModule } from '@nestjs/testing';
import { DoctorProfileRepository } from './doctor-profile.repository';

describe('DoctorProfileRepository', () => {
  let provider: DoctorProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorProfileRepository],
    }).compile();

    provider = module.get<DoctorProfileRepository>(DoctorProfileRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
