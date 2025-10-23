import { BaseRepository } from "../../IBaseRepository";
import { IMechanicRepository } from "../interface/IMechanicRepository";
import { IMechanic } from "../../../types/mechanic";
import { Mechanic } from "../../../models/mechanic";
import { GetPaginationQuery } from "../../../types/common";
import { FilterQuery, Types } from "mongoose";

export class MechanicRepository
  extends BaseRepository<IMechanic>
  implements IMechanicRepository
{
  constructor() {
    super(Mechanic);
  }
  async register(mechanicData: { garageId: string; userId: string }) {
    const mechanicToSave = {
      garageId: new Types.ObjectId(mechanicData.garageId),
      userId: new Types.ObjectId(mechanicData.userId),
    };

    await this.create(mechanicToSave);
    return { message: "Registered successful." };
  }

  async findOneAndUpdate(userId: string, data: Partial<IMechanic>) {
    return await Mechanic.findOneAndUpdate({ userId: userId }, data, {
      new: true,
    });
  }

  async getAllMechanics({ id, page, limit, searchQuery }: GetPaginationQuery) {
    const skip = (page - 1) * limit;
    const searchFilter = {
      garageId: id,
      ...(searchQuery && { name: { $regex: searchQuery, $options: "i" } }),
    };

    const mechanics = await Mechanic.find(searchFilter)
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalMechanics = await Mechanic.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalMechanics / limit);

    return { mechanics, totalMechanics, totalPages };
  }

  async findOneAndDelete(filter:FilterQuery<IMechanic>): Promise<IMechanic | null> {
    return await this.model.findOneAndDelete(filter);
  }
}
