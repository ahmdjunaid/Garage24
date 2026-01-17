import { GetPaginationQuery } from "../../../types/common";
import IAdminService from "../interface/IAdminService";
import { IAdminRepository } from "../../../repositories/superAdmin/interface/IAdminRepository";
import { GetMappedUsersResponse } from "../../../types/admin";
import { usersDataMapping } from "../../../utils/dto/usersDto";
import { garageDataMapping } from "../../../utils/dto/garagesDto";
import { GetMappedGarageResponse, IGarage, IPopulatedGarage } from "../../../types/garage";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  GARAGE_APPROVAL_FAILED,
  USER_STATUS_UPDATE_FAILED,
} from "../../../constants/messages";
import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository) private _adminRepository: IAdminRepository,
    @inject(TYPES.GarageRepository) private _garageRepository: IGarageRepository
  ) {}

  async getAllUsers(
    query: GetPaginationQuery
  ): Promise<GetMappedUsersResponse> {
    const response = await this._adminRepository.getAllUsers(query);
    const mappedResponse = {
      users: response.users.map((user) => usersDataMapping(user)),
      totalUsers: response.totalUsers,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async getAllGarages(
    query: GetPaginationQuery
  ): Promise<GetMappedGarageResponse> {
    const response = await this._adminRepository.getAllGarages(query);
    const mappedResponse = {
      garages: response.garages.map((garage: IPopulatedGarage) =>
        garageDataMapping(garage)
      ) as unknown as IGarage[],
      totalGarages: response.totalGarages,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async toggleStatus(
    userId: string,
    action: string
  ): Promise<{ message: string }> {
    const data = {
      isBlocked: action === "block" ? true : false,
    };
    const response = await this._adminRepository.findByIdAndUpdate(
      userId,
      data
    );

    if (!response) {
      throw new AppError(HttpStatus.BAD_REQUEST, USER_STATUS_UPDATE_FAILED)
    }

    return { message: `${action}ed successfull` };
  }

  async garageApproval(
    userId: string,
    action: string
  ): Promise<{ message: string }> {

    const response = await this._garageRepository.findOneAndUpdate(
      { userId},
      {approvalStatus: action}
    );

    if (!response) {
      throw new AppError(HttpStatus.BAD_REQUEST, GARAGE_APPROVAL_FAILED)
    }

    return { message: `${action}ed successfull` };
  }
}
