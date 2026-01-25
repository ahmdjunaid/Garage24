import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";
import IGarageService from "../interface/IGarageService";
import { IAuthRepository } from "../../../repositories/auth/interface/IAuthRepositories";
import mongoose from "mongoose";
import { deleteFromS3, uploadFile } from "../../../config/s3Service";
import {
  GarageNearbyDto,
  GetMappedGarageResponse,
  IAddress,
  IGarage,
  IPopulatedGarage,
} from "../../../types/garage";
import { deleteLocalFile } from "../../../helper/helper";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { extractS3KeyFromUrl } from "../../../utils/extractS3KeyFromUrl";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import { AppError } from "../../../middleware/errorHandler";
import { GARAGE_APPROVAL_FAILED } from "../../../constants/messages";
import { garageDataMapping } from "../../../utils/dto/garagesDto";
import { GetPaginationQuery } from "../../../types/common";
import { IEmailService } from "../../email/interface/IEmailService";

@injectable()
export class GarageService implements IGarageService {
  constructor(
    @inject(TYPES.GarageRepository)
    private _garageRepository: IGarageRepository,
    @inject(TYPES.AuthRepository) private _authRepository: IAuthRepository,
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.MechanicRepository)
    private _mechanicRepository: IMechanicRepository,
    @inject(TYPES.EmailService) private _emailService: IEmailService
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
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Onboarding update not allowed"
      );
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
        coordinates: [Number(location.lat), Number(location.lng)] as [
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
    const futureSubs =
      await this._subscriptionRepository.getFutureSubscriptions(garageId);

    if (!currentPlan) {
      return { isActive: false, plan: null, pendingSubs: [] };
    }

    return { isActive: true, plan: currentPlan, pendingSubs: futureSubs };
  }

  async getGarageById(garageId: string): Promise<IGarage | null> {
    return await this._garageRepository.findOne({ userId: garageId });
  }

  async getGarageDetails(garageId: string) {
    const [garage, subscription, mechanics] = await Promise.all([
      this._garageRepository.findOne({ userId: garageId }),
      this._subscriptionRepository.getSubscriptionByGarageId(garageId),
      this._mechanicRepository.getMechnaicsByGarageId(garageId),
    ]);

    return { garage, subscription, mechanics };
  }

  async findNearbyGarages(
    lat: number,
    lng: number
  ): Promise<GarageNearbyDto[]> {
    return await this._garageRepository.findNearbyGarages(lat, lng);
  }

  async getAllGarages(
    query: GetPaginationQuery
  ): Promise<GetMappedGarageResponse> {
    const response = await this._garageRepository.getAllGarages(query);
    const mappedResponse = {
      garages: response.garages.map((garage: IPopulatedGarage) =>
        garageDataMapping(garage)
      ) as unknown as IGarage[],
      totalGarages: response.totalGarages,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async garageApproval(
    userId: string,
    action: string,
    reason: string
  ): Promise<{ message: string }> {
    const updateData =
      action === "approved"
        ? { approvalStatus: action, rejectionReason: null }
        : { approvalStatus: action, rejectionReason: reason };

    const response = await this._garageRepository.findOneAndUpdate(
      { userId },
      updateData
    );

    if (!response) {
      throw new AppError(HttpStatus.BAD_REQUEST, GARAGE_APPROVAL_FAILED);
    }

    if (response && action === "rejected") {
      await Promise.all([
        deleteFromS3(extractS3KeyFromUrl(response.imageUrl)),
        deleteFromS3(extractS3KeyFromUrl(response.docUrl)),
      ]);
    }

    const garage = await this._authRepository.findById(userId);

    if (response?.approvalStatus === "approved" && garage) {
      await this._emailService.sendGarageApprovalEmail(
        garage?.email,
        garage?.name
      );
    } else if (response?.approvalStatus === "rejected" && garage) {
      await this._emailService.sendGarageRejectionEmail(
        garage?.email,
        garage?.name,
        reason
      );
    }

    return { message: `${action}ed successfull` };
  }
}
