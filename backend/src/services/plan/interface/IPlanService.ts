import { GetPaginationQuery } from "../../../types/common";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";

export default interface IPlanService {
  createPlan(data: Partial<IPlan>): Promise<{message: string}>;
  getAllPlans(query: GetPaginationQuery):Promise<GetMappedPlanResponse>;
  getPlanById(id: string):Promise<IPlan | null>;
  toggleStatus(planId: string, action: string): Promise<{ message: string }>;
  deletePlan(planId: string): Promise<{ message: string }>;
  updatePlan(planId: string, data: Partial<IPlan>): Promise<{message: string}>
}