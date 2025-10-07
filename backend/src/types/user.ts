import { Document } from "mongoose";
// import { ObjectId } from "mongodb";

export type Role = "user" | "admin" | "garage" | "mechanic";

export interface ResetTokenPayload {
  Id: string;
}

export interface IUser extends Document {
  // _id: ObjectId;
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
  // createdAt: Date;
  // updatedAt: Date;
  isOnboardingRequired?: boolean;
}
