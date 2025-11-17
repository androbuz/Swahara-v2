import { Test, TestingModule } from '@nestjs/testing';
import { OTPRepository } from './otp.repository';

describe('OtpRepository', () => {
  let provider: OTPRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OTPRepository],
    }).compile();

    provider = module.get<OTPRepository>(OTPRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
