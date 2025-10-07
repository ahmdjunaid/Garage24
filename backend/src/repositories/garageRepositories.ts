import { BaseRepository } from "../interface/repositories/IBaseRepository";
import { IGarageRepository } from "../interface/repositories/IGarageRepository";
import { IGarage } from "../types/garage";
import { Garage } from "../models/garage";
import { Types } from "mongoose";

export class GarageRepository
  extends BaseRepository<IGarage>
  implements IGarageRepository
{
  constructor() {
    super(Garage);
  }
  async onboarding (garageData: {
    garageId: Types.ObjectId;
    location: { lat: number; lng: number };
    plan: string;
    startTime: string;
    endTime: string;
    selectedHolidays: string[];
    imageUrl: string;
    mobileNumber: string;
    isRSAEnabled: boolean;
  }){
    const garage = new Garage({
        garageId: garageData.garageId,
        location: garageData.location,
        plan: garageData.plan,
        startTime: garageData.startTime,
        endTime: garageData.endTime,
        selectedHolidays: garageData.selectedHolidays,
        imageUrl: garageData.imageUrl,
        mobileNumber: garageData.mobileNumber,
        isRSAEnabled: garageData.isRSAEnabled
    })

    const savedGarage = await garage.save()
    return { garageData: savedGarage }
  }
}
