import { UserDocument } from "../../../models/user";
import { ProfileDataUpdate } from "../../../types/common";
import { IUser } from "../../../types/user";

export default interface IAuthService {
  register(
    name: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ message: string }>;

  login(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }>;

  verifyOtp(
    email: string,
    otp: string,
    context: "register" | "other"
  ): Promise<{
    message: string;
    token: string;
    userId: string;
  }>;

  forgotPassword(email: string): Promise<{
    message: string;
  }>;

  resendOtp(
    email: string,
    context: "register" | "other"
  ): Promise<{
    message: string;
  }>;

  resetPassword(email: string, password: string): Promise<{ message: string }>;
  googleAuth(
    accessToken: string
  ): Promise<{ user: IUser; token: string; refreshToken: string }>;
  refreshToken(refreshToken: string): Promise<{ newAccessToken: string }>;
  getUserDataById(userId: string): Promise<UserDocument | null>;
  updateProfileData(data:ProfileDataUpdate): Promise<IUser|null>;
  changePassword(userId:string, oldPassword:string, newPassword:string): Promise<string>
}
