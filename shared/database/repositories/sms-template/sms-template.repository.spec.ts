import { Test, TestingModule } from '@nestjs/testing';
import { SmsTemplateRepository } from './sms-template.repository';

describe('SmsTemplateRepository', () => {
  let provider: SmsTemplateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsTemplateRepository],
    }).compile();

    provider = module.get<SmsTemplateRepository>(SmsTemplateRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
