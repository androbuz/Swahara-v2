import { Test, TestingModule } from '@nestjs/testing';
import { InviteRepository } from './invite-repository';

describe('InviteRepository', () => {
  let provider: InviteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteRepository],
    }).compile();

    provider = module.get<InviteRepository>(InviteRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
