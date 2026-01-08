import { FilterQuery, HydratedDocument, Types, UpdateQuery } from "mongoose";
import {
  GetMappedGarageResponse,
  IAddress,
  IGarage,
} from "../../../types/garage";
import { GetPaginationQuery } from "../../../types/common";

export interface IGarageRepository {
  onboarding(garageData: {
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
  }): Promise<HydratedDocument<IGarage>>;

  getAllGarages({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<GetMappedGarageResponse>;
  findOneAndDelete(filter: FilterQuery<IGarage>): Promise<HydratedDocument<IGarage> | null>;
  findOne(filter: FilterQuery<IGarage>): Promise<HydratedDocument<IGarage> | null>;
  findOneAndUpdate(
    filter: FilterQuery<IGarage>,
    update: UpdateQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null>;
  findById(id: string): Promise<HydratedDocument<IGarage> | null>;
}
