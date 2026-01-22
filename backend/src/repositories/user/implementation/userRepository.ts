import { User } from "../../../models/user";
import { GetPaginationQuery } from "../../../types/common";
import { GetUserResponse, IUser } from "../../../types/user";
import { BaseRepository } from "../../IBaseRepository";
import { IUserRepository } from "../interface/IUserRepository";

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async getAllUsers({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<GetUserResponse> {
    const skip = (page - 1) * limit;
    const searchFilter = searchQuery
      ? {
          $and: [
            { name: { $regex: searchQuery, $options: "i" } },
            { role: "user" },
          ],
        }
      : { role: "user" };

    const users = await this.model
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalUsers / limit);

    return { users, totalUsers, totalPages };
  }

  async findByIdAndUpdate(userId: string, data: Partial<IUser>) {
    return await this.model.findByIdAndUpdate(userId, data, { new: true });
  }
}
