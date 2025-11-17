import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OtpModule } from './otp/otp.module';
import { JwtTokenModule } from './jwt-token/jwt-token.module';
import { AppConfigModule } from './config/app-config.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    NotificationsModule,
    OtpModule,
    JwtTokenModule,
    PermissionsModule,
  ],
})
export class SharedModule {}
