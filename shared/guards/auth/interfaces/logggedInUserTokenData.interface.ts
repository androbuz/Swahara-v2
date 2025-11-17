export interface ILoggedInUserTokenData {
  publicId: string;
  email: string;
  phoneNumber?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  profileCompleted: boolean;
  profile?: {
    firstName: string;
    lastName: string;
    fullName: string;
  };
}
