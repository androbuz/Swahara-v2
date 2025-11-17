import { Test, TestingModule } from '@nestjs/testing';
import { UserProfileRepository } from './user-profile.repository';

describe('UserProfileRepository', () => {
  let provider: UserProfileRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserProfileRepository],
    }).compile();

    provider = module.get<UserProfileRepository>(UserProfileRepository);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
