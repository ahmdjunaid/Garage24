import { IUser } from "../../../types/user";

export default interface IAuthService {
  register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ user: IUser }>;


  login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }>;


  verifyOtp(
    email: string,
    otp: string
  ): Promise<{
    message: string;
    token: string;
  }>;

  forgotPassword(
    email: string
  ): Promise<{
    message:string
  }>;

  resendOtp(
    email: string
  ): Promise<{
    message:string
  }>;

  resetPassword(email:string, password:string): Promise<{message:string}>

  googleAuth(accessToken:string): Promise<{user:IUser, token: string, refreshToken:string}>;
  refreshToken(refreshToken:string): Promise<{newAccessToken:string}>
}
