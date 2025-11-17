import { Test, TestingModule } from '@nestjs/testing';
import { PermissionSeederService } from './permission-seeder.service';

describe('PermissionSeederService', () => {
  let service: PermissionSeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionSeederService],
    }).compile();

    service = module.get<PermissionSeederService>(PermissionSeederService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
