import { Global, Module } from '@nestjs/common';
import { EmailNotificationsService } from './email/service/email.notifications.service';
import { SmsNotificationsService } from './sms/sms.notifications.service';
import { Resend } from 'resend';
import { AppConfigService } from '../config/service/app-config.service';

@Global()
@Module({
  providers: [
    {
      provide: 'RESEND',
      useFactory: (appConfigService: AppConfigService) => {
        return new Resend(appConfigService.resendApiKey);
      },
      inject: [AppConfigService],
    },
    EmailNotificationsService,
    SmsNotificationsService,
  ],
  exports: [EmailNotificationsService, SmsNotificationsService, 'RESEND'],
})
export class NotificationsModule {}
