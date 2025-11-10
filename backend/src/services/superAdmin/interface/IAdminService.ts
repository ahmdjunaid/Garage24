import { GetPaginationQuery } from "../../../types/common";
import { GetMappedUsersResponse } from "../../../types/admin";
import { GetMappedGarageResponse } from "../../../types/garage";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";

export default interface IAdminService {
  getAllUsers(query: GetPaginationQuery):Promise<GetMappedUsersResponse>;
  getAllGarages(query: GetPaginationQuery):Promise<GetMappedGarageResponse>;
  toggleStatus(userId:string,action: string): Promise<{message:string}>;
  createPlan(data: Partial<IPlan>): Promise<{message: string}>;
  getAllPlans(query: GetPaginationQuery):Promise<GetMappedPlanResponse>;
  getPlanById(id: string):Promise<IPlan | null>;
}