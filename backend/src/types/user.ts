import { Document } from "mongoose";

export type Role = "user" | "admin" | "garage" | "mechanic";

export interface ResetTokenPayload {
  Id: string;
}

export interface DecodedUser {
  id: string;
  role: string;
}


export interface IUser extends Document {
  Id: string;
  name: string;
  email: string;
  imageUrl?: string;
  age?: number;
  gender?: string;
  mobileNumber?: string;
  role: Role;
  isBlocked: boolean;
  password?: string;
  otp?: string | undefined;
  otpExpires?: Date | undefined;
  isVerified: boolean;
  googleID?: string;
  isOnboardingRequired?: boolean;
}


export interface GetUserResponse{
  users:IUser[]
  totalUsers: number;
  totalPages: number;
}