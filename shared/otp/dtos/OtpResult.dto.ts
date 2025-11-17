export interface OtpResult {
  success: boolean;
  message: string;
  otpId: string;
  otpCode?: string;
  expiresAt?: Date;
  attemptsRemaining?: number;
  waitTime?: number;
}
