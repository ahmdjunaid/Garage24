import { GetMappedGarageResponse } from "../../../types/garage";
import { GetPaginationQuery } from "../../../types/common";
import { GetUserResponse, IUser } from "../../../types/user";
import { UserDocument } from "../../../models/user";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";
import { PlanDocument } from "../../../models/plan";

export interface IAdminRepository {
  getAllGarages({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetMappedGarageResponse>;
  getAllUsers({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetUserResponse>;
  findByIdAndUpdate( userId: string, data: Partial<IUser>): Promise< UserDocument | null >;
  createPlan( data: Partial<IPlan> ): Promise< PlanDocument | null >;
  getAllPlans({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetMappedPlanResponse>;
  getPlanById(id: string):Promise<IPlan | null>;
}
