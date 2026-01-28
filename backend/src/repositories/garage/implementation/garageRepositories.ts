import { BaseRepository } from "../../IBaseRepository";
import { IGarageRepository } from "../interface/IGarageRepository";
import {
  GarageNearbyDto,
  IAddress,
  IGarage,
  IPopulatedGarage,
} from "../../../types/garage";
import { Garage } from "../../../models/garage";
import { FilterQuery, HydratedDocument, Types, UpdateQuery } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import { injectable } from "inversify";

const GARAGE_SEARCH_RADIUS = 25000; //25KM

@injectable()
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
    location: {
      type: "Point";
      coordinates: [number, number];
    };
    address: IAddress;
    startTime: string;
    endTime: string;
    selectedHolidays: string[];
    imageUrl: string;
    docUrl: string;
    mobileNumber: string;
    isRSAEnabled: boolean;
    numOfServiceBays: number;
    supportedFuelTypes: string[];
  }) {
    return await this.model.create(garageData);
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

    const garages = await this.model
      .find(searchFilter)
      .populate("userId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec() as unknown as IPopulatedGarage[];

    const totalGarages = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalGarages / limit);

    return { garages, totalGarages, totalPages };
  }

  async findOneAndDelete(
    filter: FilterQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null> {
    return await this.model.findOneAndDelete(filter);
  }

  async findOne(
    filter: FilterQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null> {
    return await this.getByFilter(filter);
  }

  async findOneAndUpdate(
    filter: FilterQuery<IGarage>,
    update: UpdateQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null> {
    return this.model.findOneAndUpdate(
      filter,
      { $set: update },
      {
        new: true,
      }
    );
  }

  async findById(id: string) {
    return await this.getById(id);
  }

  async findNearbyGarages(lat: number, lng: number): Promise<GarageNearbyDto[]> {
    return await this.model.aggregate<GarageNearbyDto>([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lat, lng],
          },
          distanceField: "distance",
          maxDistance: GARAGE_SEARCH_RADIUS,
          spherical: true,
        },
      },
      {
        $project: {
          name: 1,
          userId: 1,
          address: 1,
          distance: 1,
          supportedFuelTypes: 1,
          selectedHolidays: 1,
          numOfServiceBays: 1,
          isRSAEnabled: 1,
          imageUrl: 1,
        },
      },
    ]);
  }
}
