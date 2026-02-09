import { BaseRepository } from "../../IBaseRepository";
import { IMechanicRepository } from "../interface/IMechanicRepository";
import { AssignableMechanic, IMechanic } from "../../../types/mechanic";
import { Mechanic, MechanicDocument } from "../../../models/mechanic";
import { GetPaginationQuery } from "../../../types/common";
import { FilterQuery, Types } from "mongoose";
import { injectable } from "inversify";

@injectable()
export class MechanicRepository
  extends BaseRepository<IMechanic>
  implements IMechanicRepository
{
  constructor() {
    super(Mechanic);
  }
  async register(mechanicData: {
    garageId: string;
    userId: string;
    name: string;
  }) {
    const mechanicToSave = {
      garageId: new Types.ObjectId(mechanicData.garageId),
      userId: new Types.ObjectId(mechanicData.userId),
      name: mechanicData.name,
    };

    await this.create(mechanicToSave);
    return { message: "Registered successful." };
  }

  async findOneAndUpdate(userId: string, data: Partial<IMechanic>) {
    return await this.model.findOneAndUpdate({ userId: userId }, data, {
      new: true,
    });
  }

  async getAllMechanics({ id, page, limit, searchQuery }: GetPaginationQuery) {
    const skip = (page - 1) * limit;
    const searchFilter = {
      garageId: id,
      ...(searchQuery && { name: { $regex: searchQuery, $options: "i" } }),
      isDeleted: false,
      isBlocked: false,
    };

    const mechanics = await this.model
      .find(searchFilter)
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalMechanics = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalMechanics / limit);

    return { mechanics, totalMechanics, totalPages };
  }

  async findOneAndDelete(
    filter: FilterQuery<IMechanic>
  ): Promise<IMechanic | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async findById(id: string): Promise<MechanicDocument | null> {
    return await this.model.findById(id);
  }

  async countDocuments(garageId: string) {
    return await this.model.countDocuments({
      garageId,
      isDeleted: false,
      isBlocked: false,
    });
  }

  async getMechnaicsByGarageId(garageId: string): Promise<MechanicDocument[] | null> {
    return await this.getAll({ garageId });
  }

  async getAssignableMechanics(garageId: string): Promise<AssignableMechanic[]> {
    return this.model.find({garageId, isBlocked:false, isDeleted:false})
      .select("_id name skills userId" )
      .sort({name: 1})
  }

  async findOneByUserId(mechanicId: string): Promise<MechanicDocument | null> {
    return this.getByFilter({userId: mechanicId})
  }
}
