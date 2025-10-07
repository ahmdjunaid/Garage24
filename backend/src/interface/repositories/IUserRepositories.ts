import { HydratedDocument } from "mongoose";
import { UserDocument } from "../../models/user";
import { IUser } from "../../types/user";

export interface IAuthRepository {
  register(userData: {
    Id: string,
    name: string,
    email: string,
    role: string,
    googleID?:string,
    imageUrl?: string,
    hashedOtp?: string,
    otpExpires?: Date,
    hashedPassword?: string
  }
  ): Promise<{
    user: HydratedDocument<UserDocument>;
  }>;

  findByEmail(email: string): Promise<HydratedDocument<UserDocument> | null>;
  findById(id: string): Promise<HydratedDocument<UserDocument> | null>;
  findByIdAndUpdate(
    userId: string,
    data: Partial<IUser>
  ): Promise<HydratedDocument<UserDocument> | null>;
}
