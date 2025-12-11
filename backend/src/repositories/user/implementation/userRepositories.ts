import { User } from "../../../models/user";
import { IUser, Role } from "../../../types/user";
import { BaseRepository } from "../../IBaseRepository";
import { IAuthRepository } from "../interface/IUserRepositories";

export class AuthRepository
  extends BaseRepository<IUser>
  implements IAuthRepository
{
  constructor() {
    super(User);
  }

  async register(userData: {
    Id: string;
    name: string;
    email: string;
    role: Role;
    googleID?: string;
    imageUrl?: string;
    hashedPassword?: string;
  }) {
    const data = {
      Id: userData.Id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      ...(userData.hashedPassword && { password: userData.hashedPassword }),
      ...(userData.googleID && { googleID: userData.googleID }),
      ...(userData.imageUrl && { imageUrl: userData.imageUrl }),
      isOnboardingRequired: userData.role === "user" ? false : true,
    };
    const savedUser = await this.create(data);
    return { user: savedUser };
  }

  async findByEmail(email: string) {
    return await this.getByFilter({
      email: email,
      isDeleted: false,
      isBlocked: false,
    });
  }

  async findOneAndUpdate(userId: string, data: Partial<IUser>) {
    return await this.updateOneByFilter(
      { _id: userId, isDeleted: false, isBlocked: false },
      data
    );
  }

  async findById(id: string) {
    return await this.getById(id);
  }

  async findByIdAndDelete(userId: string) {
    return await this.deleteById(userId);
  }

  async findByIdAndUpdate(userId: string, data: Partial<IUser>) {
    return await this.updateById(userId, data);
  }
}
