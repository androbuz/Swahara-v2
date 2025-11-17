import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentRepository } from './appointment-repository';

describe('AppointmentRepository', () => {
  let provider: AppointmentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentRepository],
    }).compile();

    provider = module.get<AppointmentRepository>(AppointmentRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
