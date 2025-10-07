import { IGarageRepository } from "../interface/repositories/IGarageRepository";
import IGarageService from "../interface/services/garage/IGarageService";
import cloudinary from "../config/cloudinary";
import { IAuthRepository } from "../interface/repositories/IUserRepositories";
import mongoose from "mongoose";

export class GarageService implements IGarageService {
  constructor(
    private _garageRepository: IGarageRepository,
    private _authRepository: IAuthRepository
  ) {}
  async onboarding(
    garageId: string,
    location: { lat: number; lng: number },
    plan: string,
    startTime: string,
    endTime: string,
    selectedHolidays: string[],
    image: string,
    mobile: string,
    isRSAEnabled: boolean
  ) {
    const res = await cloudinary.uploader.upload(image, {
      folder: "garage24/garageImages",
    });

    const convertedGarageId = new mongoose.Types.ObjectId(garageId)

    const garageData = await this._garageRepository.onboarding({
      garageId: convertedGarageId,
      location,
      plan,
      startTime,
      endTime,
      selectedHolidays,
      imageUrl: res.secure_url,
      mobileNumber: mobile,
      isRSAEnabled,
    });

    await this._authRepository.findByIdAndUpdate(garageId, {isOnboardingRequired: false,});
    return garageData;
  }
}
