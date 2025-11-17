export interface IPatientWelcomeEmailParams extends Record<string, string> {
  firstName: string;
  fullName: string;
  otpCode: string;
  OTPExpiry: string;
  logoUrl: string;
}
