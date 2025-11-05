import { GetPaginationQuery } from "../../../types/common";
import IAdminService from "../interface/IAdminService";
import { IAdminRepository } from "../../../repositories/superAdmin/interface/IAdminRepository";
import { GetMappedUsersResponse } from "../../../types/admin";
import { usersDataMapping } from "../../../utils/dto/usersDto";
import { garageDataMapping } from "../../../utils/dto/garagesDto";
import { GetMappedGarageResponse, IGarage } from "../../../types/garage";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_CREATINGPLAN,
  USER_STATUS_UPDATE_FAILED,
} from "../../../constants/messages";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";

export class AdminService implements IAdminService {
  constructor(private _adminRepository: IAdminRepository) {}

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
      garages: response.garages.map((garage: any) =>
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
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: USER_STATUS_UPDATE_FAILED,
      };
    }

    return { message: `${action}ed successfull` };
  }

  async createPlan(data: Partial<IPlan>): Promise<{ message: string }> {
    const response = await this._adminRepository.createPlan(data);

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_CREATINGPLAN,
      };
    }

    return { message: "Plan created successfully" };
  }

  async getAllPlans(
      query: GetPaginationQuery
    ): Promise<GetMappedPlanResponse> {
      const response = await this._adminRepository.getAllPlans(query);
  
      const mappedResponse = {
        plans: response.plans,
        totalPlans: response.totalPlans,
        totalPages: response.totalPages,
      };
  
      return mappedResponse;
    }
}
