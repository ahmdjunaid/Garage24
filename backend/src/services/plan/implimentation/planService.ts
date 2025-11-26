import { GetPaginationQuery } from "../../../types/common";
import IPlanService from "../interface/IPlanService";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_CREATINGPLAN,
  ERROR_WHILE_PLAN_UPDATE,
  PLAN_ALREADY_EXIST,
  PLAN_CREATED_SUCCESS,
  PLAN_NOT_FOUND,
} from "../../../constants/messages";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IPlanRepository } from "../../../repositories/plan/interface/IPlanRepository";

@injectable()
export class PlanService implements IPlanService {
  constructor(
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository
  ) {}

  async createPlan(data: Partial<IPlan>): Promise<{ message: string }> {
    const existing = await this._planRepository.getPlanByName(data.name!);

    if (existing) {
      throw { status: HttpStatus.CONFLICT, message: PLAN_ALREADY_EXIST };
    }

    const response = await this._planRepository.createPlan(data);

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_CREATINGPLAN,
      };
    }

    return { message: PLAN_CREATED_SUCCESS };
  }

  async getAllPlans(query: GetPaginationQuery): Promise<GetMappedPlanResponse> {
    const response = await this._planRepository.getAllPlans(query);

    const mappedResponse = {
      plans: response.plans,
      totalPlans: response.totalPlans,
      totalPages: response.totalPages,
    };

    return mappedResponse;
  }

  async getPlanById(id: string): Promise<IPlan | null> {
    const plan = await this._planRepository.getPlanById(id);

    if (!plan) throw { status: HttpStatus.NOT_FOUND, message: PLAN_NOT_FOUND };

    return plan;
  }

  async toggleStatus(planId: string, action: string) {
    const data = {
      isBlocked: action === "block" ? true : false,
    };
    const response = await this._planRepository.findOneAndUpdate(planId, data);

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_PLAN_UPDATE,
      };
    }

    return { message: `${action}ed successfull` };
  }

  async deletePlan(planId: string): Promise<{ message: string }> {

    const response = await this._planRepository.findOneAndUpdate(planId, {
      isDeleted: true,
    });

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_PLAN_UPDATE,
      };
    }

    return { message: "Deleted successfull" };
  }

  async updatePlan(planId: string, data: Partial<IPlan>): Promise<{ message: string; }> {
    const plan = await this._planRepository.findOneAndUpdate(planId,data)
    if(!plan){
      throw {status: HttpStatus.BAD_REQUEST, message: PLAN_NOT_FOUND}
    }

    return { message: "Plan updated successful" }
  }
}
