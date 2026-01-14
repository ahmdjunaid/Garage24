import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";
import IGarageService from "../interface/IGarageService";
import { IAuthRepository } from "../../../repositories/auth/interface/IAuthRepositories";
import mongoose from "mongoose";
import { deleteFromS3, uploadFile } from "../../../config/s3Service";
import axios from "axios";
import { IAddress, IGarage } from "../../../types/garage";
import { deleteLocalFile } from "../../../helper/helper";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { extractS3KeyFromUrl } from "../../../utils/extractS3KeyFromUrl";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";

@injectable()
export class GarageService implements IGarageService {
  constructor(
    @inject(TYPES.GarageRepository)
    private _garageRepository: IGarageRepository,
    @inject(TYPES.AuthRepository) private _authRepository: IAuthRepository,
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.MechanicRepository)
    private _mechanicRepository: IMechanicRepository
  ) {}
  async onboarding(
    name: string,
    userId: string,
    location: { lat: number; lng: number },
    address: IAddress,
    startTime: string,
    endTime: string,
    selectedHolidays: string[],
    image: Express.Multer.File,
    document: Express.Multer.File,
    mobile: string,
    isRSAEnabled: boolean,
    numOfServiceBays: number,
    supportedFuelTypes: string[]
  ) {
    const convertedUserId = new mongoose.Types.ObjectId(userId);
    const existing = await this._garageRepository.findOne({
      userId: convertedUserId,
    });

    if (existing && existing.approvalStatus !== "rejected") {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "Onboarding update not allowed",
      };
    }

    const imageUrl = await uploadFile(image, "garages");
    const docUrl = await uploadFile(document, "garages");
    if (image?.path) deleteLocalFile(image.path);
    if (document?.path) deleteLocalFile(document.path);

    const data = {
      name,
      userId: convertedUserId,
      location: {
        type: "Point" as const,
        coordinates: [Number(location.lng), Number(location.lat)] as [
          number,
          number,
        ],
      },
      address,
      startTime,
      endTime,
      selectedHolidays,
      imageUrl,
      docUrl,
      mobileNumber: mobile,
      isRSAEnabled,
      numOfServiceBays,
      supportedFuelTypes,
      approvalStatus: "pending",
      rejectionReason: undefined,
    };

    const garageData = existing
      ? await this._garageRepository.findOneAndUpdate(
          { userId: convertedUserId },
          data
        )
      : await this._garageRepository.onboarding(data);

    if (existing) {
      await Promise.all([
        deleteFromS3(extractS3KeyFromUrl(existing.imageUrl)),
        deleteFromS3(extractS3KeyFromUrl(existing.docUrl)),
      ]);
    }

    await this._authRepository.findOneAndUpdate(userId, {
      isOnboardingRequired: false,
      imageUrl: imageUrl,
    });

    return garageData;
  }

  async getAddressFromCoordinates(lat: string, lng: string) {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat,
          lon: lng,
          format: "json",
        },
        headers: {
          "User-Agent": "Garage24-Backend/1.0 (contact: support@garage24.com)",
          "Accept-Language": "en",
        },
        timeout: 5000,
      }
    );

    const data = response.data;

    return {
      city:
        data.address?.city ||
        data.address?.town ||
        data.address?.village ||
        data.address?.county ||
        "",
      district: data.address?.state_district || "",
      state: data.address?.state || "",
      pincode: data.address?.postcode || "",
    };
  }

  async getApprovalStatus(userId: string) {
    const garage = await this._garageRepository.findOne({ userId: userId });

    if (!garage) {
      return { hasGarage: false, approvalStatus: "", hasActivePlan: false };
    }

    return {
      hasGarage: true,
      approvalStatus: garage.approvalStatus,
    };
  }

  async getCurrentPlan(garageId: string) {
    const currentPlan =
      await this._subscriptionRepository.getSubscriptionByGarageId(garageId);
    if (!currentPlan) {
      return { isActive: false, plan: null };
    }

    return { isActive: true, plan: currentPlan };
  }

  async getGarageById(garageId: string): Promise<IGarage | null> {
    return await this._garageRepository.findOne({ userId: garageId });
  }

  async getGarageDetails(garageId: string) {
    const [garage, subscription, mechanics] = await Promise.all([
      this._garageRepository.findOne({userId: garageId}),
      this._subscriptionRepository.getSubscriptionByGarageId(garageId),
      this._mechanicRepository.getMechnaicsByGarageId(garageId),
    ]);

    return { garage, subscription, mechanics };
  }
}
