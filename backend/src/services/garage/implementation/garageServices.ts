import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";
import IGarageService from "../interface/IGarageService";
import { IAuthRepository } from "../../../repositories/user/interface/IUserRepositories";
import mongoose from "mongoose";
import { uploadFile } from "../../../config/s3Service";
import axios from "axios";
import { IAddress } from "../../../types/garage";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import { GetMappedMechanicResponse } from "../../../types/mechanic";
import { GetPaginationQuery } from "../../../types/common";
import { mechanicDataMapping } from "../../../utils/dto/mechanicDto";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  USER_NOT_FOUND,
  USER_STATUS_UPDATE_FAILED,
} from "../../../constants/messages";
import { deleteLocalFile } from "../../../helper/helper";
import { IAdminRepository } from "../../../repositories/superAdmin/interface/IAdminRepository";
import { GetMappedPlanResponse, ICheckoutSession } from "../../../types/plan";
import { stripe } from "../../../config/stripe";

export class GarageService implements IGarageService {
  constructor(
    private _garageRepository: IGarageRepository,
    private _authRepository: IAuthRepository,
    private _mechanicRepository: IMechanicRepository,
    private _adminRepository: IAdminRepository
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
    isRSAEnabled: boolean
  ) {
    const imageUrl = await uploadFile(image, "garages");
    const docUrl = await uploadFile(document, "garages");

    if (image?.path) deleteLocalFile(image.path);
    if (document?.path) deleteLocalFile(document.path);

    const convertedUserId = new mongoose.Types.ObjectId(userId);
    const latitude = Number(location.lat);
    const longitude = Number(location.lng);

    const garageData = await this._garageRepository.onboarding({
      name,
      userId: convertedUserId,
      latitude,
      longitude,
      address,
      startTime,
      endTime,
      selectedHolidays,
      imageUrl,
      docUrl,
      mobileNumber: mobile,
      isRSAEnabled,
    });

    await this._authRepository.findOneAndUpdate(userId, {
      isOnboardingRequired: false,
    });
    return garageData;
  }

  async getAddressFromCoordinates(lat: string, lng: string) {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse`,
      {
        params: { lat, lon: lng, format: "json" },
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

  async registerMechanic(garageId: string, userId: string) {
    const user = await this._authRepository.findById(userId);
    if (!user) throw { status: HttpStatus.NOT_FOUND, message: USER_NOT_FOUND };

    const { message } = await this._mechanicRepository.register({
      garageId,
      userId,
      name: user.name,
    });
    return { message: message };
  }

  async getAllMechanics(
    query: GetPaginationQuery
  ): Promise<GetMappedMechanicResponse> {
    const response = await this._mechanicRepository.getAllMechanics(query);

    const mappedResponse = {
      mechanics: response.mechanics.map((mechanic) =>
        mechanicDataMapping(mechanic)
      ),
      totalMechanics: response.totalMechanics,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }
  /**
   *
   * @param userId
   * @param action
   * @returns
   */
  async toggleStatus(userId: string, action: string) {
    const data = {
      isBlocked: action === "block" ? true : false,
    };
    const response = await this._authRepository.findByIdAndUpdate(userId, data);

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: USER_STATUS_UPDATE_FAILED,
      };
    }

    return { message: `${action}ed successfull` };
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    await this._mechanicRepository.findOneAndUpdate(userId, {
      isDeleted: true,
    });
    const response = await this._authRepository.findByIdAndUpdate(userId, {
      isDeleted: true,
    });

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: USER_STATUS_UPDATE_FAILED,
      };
    }

    return { message: "Deleted successfull" };
  }

  async getApprovalStatus(userId: string) {
    const garage = await this._garageRepository.findOne({ userId: userId });

    if (!garage) {
      return { hasGarage: false, approvalStatus: "", hasActivePlan: false };
    }

    const now = new Date();
    const hasActivePlan = garage?.plan?.some((plan) => plan.expiresAt > now);

    return {
      hasGarage: true,
      approvalStatus: garage.approvalStatus,
      hasActivePlan,
    };
  }

  async getAllPlans(query: GetPaginationQuery): Promise<GetMappedPlanResponse> {
    const response = await this._adminRepository.getAllPlans(query);

    const mappedResponse = {
      plans: response.plans,
      totalPlans: response.totalPlans,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async createCheckoutSession (data: ICheckoutSession) {
    const { garageId, planId, planName, planPrice } = data;

    if (!garageId || !planId || !planName || !planPrice) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: "Missing required fields",
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: planName },
            unit_amount: planPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
      metadata: { garageId, planId },
    });

    return { url: session.url! };
  };
}
