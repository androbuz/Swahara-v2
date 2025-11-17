export interface IUserInviteEmailParams extends Record<string, string> {
  otpCode: string;
  OTPExpiry: string;
  invitorName: string;
}
