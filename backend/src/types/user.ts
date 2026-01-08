import { UserDocument } from "../models/user";

export type Role = "user" | "admin" | "garage" | "mechanic";

export interface ResetTokenPayload {
  Id: string;
}

export interface DecodedUser {
  id: string;
  role: string;
}


export interface IUser {
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
  isDeleted: boolean;
  googleID?: string;
  isOnboardingRequired?: boolean;
}


export interface GetUserResponse{
  users:UserDocument[]
  totalUsers: number;
  totalPages: number;
}