import { AuthGuard } from './auth.guard';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from '../../jwt-token/service/jwt-token.service';
import { UserRepository } from '../../database/repositories/user/user.repository';

describe('AuthGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector();
    const jwtTokenService = {
      VerifyToken: jest.fn(),
    } as unknown as JwtTokenService;
    const userRepository = {
      getUserByPublicId: jest.fn(),
    } as unknown as UserRepository;

    const guard = new AuthGuard(reflector, jwtTokenService, userRepository);
    expect(guard).toBeDefined();
  });
});
