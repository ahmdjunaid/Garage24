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
  GARAGE_APPROVAL_FAILED,
  GARAGE_NOT_FOUND,
  PLAN_ALREADY_EXIST,
  PLAN_CREATED_SUCCESS,
  PLAN_NOT_FOUND,
  USER_STATUS_UPDATE_FAILED,
} from "../../../constants/messages";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";
import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _garageRepository: IGarageRepository
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

  async garageApproval(
    userId: string,
    action: string
  ): Promise<{ message: string }> {

    const response = await this._garageRepository.findOneAndUpdate(
      { userId},
      {approvalStatus: action}
    );

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: GARAGE_APPROVAL_FAILED,
      };
    }

    return { message: `${action}ed successfull` };
  }

  async createPlan(data: Partial<IPlan>): Promise<{ message: string }> {

    const existing = await this._adminRepository.getPlanByName(data.name!)

    if(existing){
      throw { status: HttpStatus.CONFLICT, message: PLAN_ALREADY_EXIST}
    }

    const response = await this._adminRepository.createPlan(data);

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_CREATINGPLAN,
      };
    }

    return { message: PLAN_CREATED_SUCCESS };
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

  async getPlanById(id: string): Promise<IPlan | null> {
    const plan = await this._adminRepository.getPlanById(id);

    if (!plan) throw { status: HttpStatus.NOT_FOUND, message: PLAN_NOT_FOUND };

    return plan;
  }

  async getGarageById(id: string): Promise<IGarage | null> {
    const garage = await this._garageRepository.findOne({userId: id});

    if (!garage) throw { status: HttpStatus.NOT_FOUND, message: GARAGE_NOT_FOUND };

    return garage;
  }
}
