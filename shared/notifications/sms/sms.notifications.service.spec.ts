import { Test, TestingModule } from '@nestjs/testing';
import { SmsNotificationsService } from './sms.notifications.service';

describe('SmsNotificationsService', () => {
  let service: SmsNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsNotificationsService],
    }).compile();

    service = module.get<SmsNotificationsService>(SmsNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
