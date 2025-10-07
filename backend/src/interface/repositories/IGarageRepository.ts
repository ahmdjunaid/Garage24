import { HydratedDocument, Types } from "mongoose";
import { IGarage } from "../../types/garage";

export interface IGarageRepository {
  onboarding(garageData: {
    garageId: Types.ObjectId,
    location: {lat: number, lng: number},
    plan: string,
    startTime: string,
    endTime:string,
    selectedHolidays: string[],
    imageUrl: string,
    mobileNumber: string,
    isRSAEnabled: boolean,
  }
  ): Promise<{
    garageData: HydratedDocument<IGarage>;
  }>;
}
