import { FilterQuery, Types } from "mongoose";
import { GetMappedGarageResponse, IAddress, IGarage } from "../../../types/garage";
import { GetPaginationQuery } from "../../../types/common";

export interface IGarageRepository {
  onboarding(garageData: {
    name: string,
    garageId: Types.ObjectId,
    latitude: number,
    longitude: number,
    address: IAddress,
    startTime: string,
    endTime:string,
    selectedHolidays: string[],
    imageUrl: string,
    docUrl:string,
    mobileNumber: string,
    isRSAEnabled: boolean,
  }
  ): Promise<{ garageData: IGarage }>;

  getAllGarages({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetMappedGarageResponse>;
  findOneAndDelete(filter: FilterQuery<IGarage>):Promise<IGarage | null>
  findOne(filter: FilterQuery<IGarage>):Promise<IGarage | null>
}
