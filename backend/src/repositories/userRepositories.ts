import User, { UserDocument } from "../models/user";
import { IUser, Role } from "../types/user";
import mongoose from "mongoose";
import { BaseRepository } from "../interface/repositories/IBaseRepository";
import { IAuthRepository } from "../interface/repositories/IUserRepositories";

export class AuthRepository
  extends BaseRepository<UserDocument>
  implements IAuthRepository
{
  constructor() {
    super(User);
  }

async register(userData: {
  Id: string,
  name: string,
  email: string,
  role: Role,
  googleID?: string,
  imageUrl?: string,
  hashedOtp?: string,
  otpExpires?: Date,
  hashedPassword?: string
}) {
  const user = new User({
    Id:userData.Id,
    name:userData.name,
    email:userData.email,
    role:userData.role,
    ...(userData.hashedPassword && { password: userData.hashedPassword }),
    ...(userData.hashedOtp && { otp: userData.hashedOtp }),               
    ...(userData.otpExpires && { otpExpires:userData.otpExpires }),                  
    ...(userData.googleID && { googleID:userData.googleID }),                      
    ...(userData.imageUrl && { imageUrl:userData.imageUrl }),
    ...(userData.googleID && { isVerified: true }),
    isOnboardingRequired: userData.role === "user" ? false : true
  });

  const savedUser = await user.save();
  return { user: savedUser };
}

  async findByEmail(email: string) {
    return await User.findOne({ email: email, isBlocked: false });
  }

  async findByIdAndUpdate(userId: string, data: Partial<IUser>) {
    return User.findByIdAndUpdate(userId, data, { new: true });
  }

  async findById(id: string) {
    return User.findById(new mongoose.Types.ObjectId(id));
  }
}
