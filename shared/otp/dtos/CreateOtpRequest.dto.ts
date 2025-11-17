import { OtpDeliveryMethod, OtpType } from '@prisma/client';

export interface CreateOtpRequest {
  otpType: OtpType;
  userId?: number;
  inviteId?: number;
  deliveryMethod: OtpDeliveryMethod;
  ipAddress: string;
  userAgent: string;
}
