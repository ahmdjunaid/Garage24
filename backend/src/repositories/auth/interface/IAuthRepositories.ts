import { UserDocument } from "../../../models/user";
import { IUser } from "../../../types/user";

export interface IAuthRepository {
  register(userData: {
    Id: string,
    name: string,
    email: string,
    role: string,
    googleID?:string,
    imageUrl?: string,
    hashedPassword?: string
  }
  ): Promise<{
    user: UserDocument;
  }>;

  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  findOneAndUpdate( userId: string, data: Partial<IUser>): Promise<UserDocument | null>;
  findByIdAndDelete( userId:string ): Promise< UserDocument | null >;
  findByIdAndUpdate( userId: string, data: Partial<IUser>): Promise<UserDocument | null>;
}
