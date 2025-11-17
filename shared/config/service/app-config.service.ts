import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ResponseUtil } from '../../utils';
import * as requiredConfigsJson from './../../../../config.json';

interface ConfigKey {
  name: string;
  description: string;
}

@Injectable()
export class AppConfigService implements OnModuleInit {
  private readonly logger = new Logger(AppConfigService.name);

  private readonly requiredConfigs: ConfigKey[] =
    requiredConfigsJson.requiredConfigs as ConfigKey[];

  constructor(private nestConfigService: NestConfigService) {}

  onModuleInit() {
    this.validateConfig();
  }

  /**
   * Validates the required configuration values.
   * Throws an error if any required configs are missing.
   *
   * @private
   */
  private validateConfig() {
    const missingConfigs: ConfigKey[] = [];

    this.requiredConfigs.forEach((config) => {
      const configValue = this.nestConfigService.get<string>(config.name);

      if (!configValue) {
        missingConfigs.push(config);
      }
    });

    if (missingConfigs.length > 0) {
      const errorDetails = missingConfigs
        .map((config) => `  - ${config.name}: ${config.description}`)
        .join('\n');

      this.logger.error(
        `⚠️⚠️ This application may not work as expected without these configs\n\nMissing required configs:\n${errorDetails}`,
      );

      ResponseUtil.throwError(
        '⚠️⚠️ Missing required configs. Please check the above error message for more details.',
        HttpStatus.FAILED_DEPENDENCY,
      );
    } else {
      this.logger.log('✅✅ All required configuration values are set');
    }
  }

  //region: Database Configuration
  get databaseUrl(): string {
    return this.nestConfigService.get<string>('DATABASE_URL', '');
  }

  get dbUsername(): string {
    return this.nestConfigService.get<string>('DB_USERNAME', '');
  }

  get dbPassword(): string {
    return this.nestConfigService.get<string>('DB_PASSWORD', '');
  }

  get dbName(): string {
    return this.nestConfigService.get<string>('DB_NAME', '');
  }

  //endregion

  //region: Server and Node Environment Configuration
  get port(): number {
    return this.nestConfigService.get<number>('PORT', 8091);
  }
  get nodeEnv(): string {
    return this.nestConfigService.get<string>('NODE_ENV', 'dev');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'dev' || this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
  //endregion

  //region: JWT Configuration
  get jwtSecret(): string {
    return this.nestConfigService.get<string>(
      'AUTH_JWT_SECRET',
      'YKOR-jrANE68kZqclSUlIA_LJZ9hh4ZUu6WhFDpVNosA6XO8TrJfoUCCcvu_hNODfw',
    );
  }

  get jwtExpiresTime(): string {
    return this.nestConfigService.get<string>('AUTH_JWT_EXPIRES_TIME', '1d');
  }

  get jwtExtendedExpiresTime(): string {
    return this.nestConfigService.get<string>(
      'AUTH_JWT_EXTENDED_EXPIRES_TIME',
      '7d',
    );
  }

  //endregion

  //region: Email Configuration
  get resendApiKey(): string {
    return this.nestConfigService.get<string>(
      'RESEND_API_KEY',
      're_AqepahcG_2tDz38DMCX8M3AKV7FubKQVv',
    );
  }

  get emailFrom(): string {
    return this.nestConfigService.get<string>(
      'EMAIL_FROM',
      'info@codel-consultancy.com',
    );
  }
  //endregion

  //region: OTP Configuration
  get otpSecret(): string {
    return this.nestConfigService.get<string>(
      'OTP_SECRET',
      '8HwFX44dHUOkaY33Aoyhhg7KWo5aWa-UKF9MVL3Xf_SQMQkLOplRV06Phqfh0rUrrA',
    );
  }

  get otpLength(): number {
    return this.nestConfigService.get<number>('OTP_LENGTH', 6);
  }

  get otpDefaultExpiration(): number {
    return this.nestConfigService.get<number>('OTP_DEFAULT_EXPIRATION', 15);
  }

  get otpMaxAttempt(): number {
    return this.nestConfigService.get<number>('OTP_MAX_ATTEMPT', 3);
  }
  //endregion

  //region: SMS Configuration
  get standardSmsLength(): number {
    return this.nestConfigService.get<number>('STANDARD_SMS_LENGTH', 160);
  }

  get africasTalkingApiKey(): string {
    return this.nestConfigService.get<string>('AFRICAS_TALKING_API_KEY', 'TBD');
  }

  get africasTalkingUsername(): string {
    return this.nestConfigService.get<string>(
      'AFRICAS_TALKING_API_USERNAME',
      'sandbox',
    );
  }

  get africasTalkingAlphanumeric(): string {
    return this.nestConfigService.get<string>(
      'AFRICAS_TALKING_API_ALPHANUMERIC',
      'TBD',
    );
  }
  //endregion

  //region: Doctor Working Hours Configuration
  get workHoursStart(): number {
    return this.nestConfigService.get<number>('WORK_HOURS_START', 8);
  }

  get workHoursEnd(): number {
    return this.nestConfigService.get<number>('WORK_HOURS_END', 17);
  }
  //endregion
}
