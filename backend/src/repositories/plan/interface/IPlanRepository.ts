import { GetPaginationQuery } from "../../../types/common";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";
import { PlanDocument } from "../../../models/plan";
import { HydratedDocument } from "mongoose";

export interface IPlanRepository {
  createPlan(data: Partial<IPlan>): Promise<PlanDocument | null>;
  getAllPlans({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<GetMappedPlanResponse>;
  getPlanById(id: string): Promise<IPlan | null>;
  getPlanByName(name: string): Promise<IPlan | null>;
  findOneAndUpdate(
    planId: string,
    data: Partial<IPlan>
  ): Promise<HydratedDocument<IPlan> | null>;
}
