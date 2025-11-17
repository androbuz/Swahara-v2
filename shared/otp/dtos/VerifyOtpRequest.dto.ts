import { OtpType } from '@prisma/client';

export interface VerifyOtpRequest {
  userId?: number;
  inviteId?: number;
  otpCode: string;
  otpType: OtpType;
  ipAddress: string;
  userAgent: string;
}
