import { Test, TestingModule } from '@nestjs/testing';
import { MetadataScannerService } from './metadata-scanner.service';

describe('MetadataScannerService', () => {
  let service: MetadataScannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataScannerService],
    }).compile();

    service = module.get<MetadataScannerService>(MetadataScannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
