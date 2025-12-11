import { IPopulatedGarage } from "../../../types/garage";
import { GetPaginationQuery } from "../../../types/common";
import { User } from "../../../models/user";
import { Garage } from "../../../models/garage";
import { IAdminRepository } from "../interface/IAdminRepository";
import { GetUserResponse, IUser } from "../../../types/user";
import { injectable, unmanaged } from "inversify";

@injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @unmanaged() private userModel: typeof User,
    @unmanaged() private garageModel: typeof Garage,
  ) {}

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

    const users = await this.userModel
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await this.userModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalUsers / limit);

    return { users, totalUsers, totalPages };
  }

  async getAllGarages({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery) {
    const skip = (page - 1) * limit;
    const searchFilter = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};

    const garages = await this.garageModel
      .find(searchFilter)
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec() as unknown as IPopulatedGarage[];

    const totalGarages = await this.garageModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalGarages / limit);

    return { garages, totalGarages, totalPages };
  }

  async findByIdAndUpdate(userId: string, data: Partial<IUser>) {
    return await this.userModel.findByIdAndUpdate(userId, data, { new: true });
  }
}
