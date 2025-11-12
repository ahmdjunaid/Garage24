import { BaseRepository } from "../../IBaseRepository";
import { IGarageRepository } from "../interface/IGarageRepository";
import { GetMappedGarageResponse, IAddress, IGarage } from "../../../types/garage";
import { Garage } from "../../../models/garage";
import { FilterQuery, Types, UpdateQuery } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";

export class GarageRepository
  extends BaseRepository<IGarage>
  implements IGarageRepository
{
  constructor() {
    super(Garage);
  }
  async onboarding(garageData: {
    name: string;
    userId: Types.ObjectId;
    latitude: number;
    longitude: number;
    address: IAddress;
    startTime: string;
    endTime: string;
    selectedHolidays: string[];
    imageUrl: string;
    docUrl: string;
    mobileNumber: string;
    isRSAEnabled: boolean;
  }) {
    const data: IGarage = {
      ...garageData,
      location: {
        type: "Point",
        coordinates: [garageData.latitude, garageData.longitude],
      },
    };

    const savedGarage = await this.model.create(data);
    return { garageData: savedGarage };
  }

  async getAllGarages({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<GetMappedGarageResponse> {
    const skip = (page - 1) * limit;
    const searchFilter = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};

    const garages = await this.model.find(searchFilter)
      .populate('userId')
      .skip(skip)
      .limit(limit)
      .sort({ 'userId.createdAt' : -1 });

    const totalGarages = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalGarages / limit);

    return { garages, totalGarages, totalPages };
  }

  async findOneAndDelete(filter:FilterQuery<IGarage>): Promise<IGarage | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async findOne(filter: FilterQuery<IGarage>): Promise<IGarage | null> {
      return await this.getByFilter(filter);
  }

  async findOneAndUpdate(filter: FilterQuery<IGarage>, update: UpdateQuery<IGarage>): Promise<IGarage | null> {
      return await this.model.findOneAndUpdate(filter, update)
  }

  async findById(id: string): Promise<IGarage | null> {
      return await this.getById(id)
  }
}
