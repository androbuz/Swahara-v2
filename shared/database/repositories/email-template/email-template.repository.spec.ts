import { Test, TestingModule } from '@nestjs/testing';
import { EmailTemplateRepository } from './email-template.repository';

describe('EmailTemplateRepository', () => {
  let provider: EmailTemplateRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailTemplateRepository],
    }).compile();

    provider = module.get<EmailTemplateRepository>(EmailTemplateRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
