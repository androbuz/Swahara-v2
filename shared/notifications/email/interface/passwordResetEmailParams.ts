export interface IPasswordResetEmailParams extends Record<string, string> {
  userName: string;
  resetLink: string;
  expiry: string;
  logoUrl: string;
}
