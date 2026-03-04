import { FilterQuery, HydratedDocument, Types, UpdateQuery } from "mongoose";
import {
  GarageNearbyDto,
  IAddress,
  IGarage,
  IPopulatedGarage,
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
    numOfServiceBays: number;
    supportedFuelTypes: string[];
  }): Promise<HydratedDocument<IGarage>>;

  getAllGarages({ page, limit, searchQuery }: GetPaginationQuery): Promise<{
    garages: IPopulatedGarage[];
    totalGarages: number;
    totalPages: number;
  }>;
  findOneAndDelete(
    filter: FilterQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null>;
  findOne(
    filter: FilterQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null>;
  findOneAndUpdate(
    filter: FilterQuery<IGarage>,
    update: UpdateQuery<IGarage>
  ): Promise<HydratedDocument<IGarage> | null>;
  findById(id: string): Promise<HydratedDocument<IGarage> | null>;
  findNearbyGarages(lat: number, lng: number): Promise<GarageNearbyDto[]>;
}
