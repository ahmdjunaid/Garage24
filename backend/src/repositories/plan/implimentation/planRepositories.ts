import { GetPaginationQuery } from "../../../types/common";
import {  IPlanRepository } from "../interface/IPlanRepository";
import { Plan, PlanDocument } from "../../../models/plan";
import { GetMappedPlanResponse, IPlan } from "../../../types/plan";
import { injectable } from "inversify";
import { BaseRepository } from "../../IBaseRepository";

@injectable()
export class PlanRepository extends BaseRepository<IPlan> implements IPlanRepository {
  constructor() {
    super(Plan)
  }

  async createPlan(data: Partial<IPlan>): Promise<PlanDocument | null> {
    return await this.model.create(data);
  }

  async getAllPlans({
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<GetMappedPlanResponse> {
    const skip = (page - 1) * limit;
    const searchFilter = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" }, isDeleted: false }
      : { isDeleted: false  };

    const plans = await this.model
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPlans = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalPlans / limit);

    return { plans, totalPlans, totalPages };
  }

  async getPlanById(id: string): Promise<IPlan | null> {
    return await this.model.findById(id);
  }

  async getPlanByName(name: string): Promise<IPlan | null> {
    return await this.model.findOne({
      name: { $regex: new RegExp(name, "i") },
    });
  }

  async findOneAndUpdate(planId: string, data: Partial<IPlan>) {
    return await this.model.findOneAndUpdate({ _id: planId }, data, {
      new: true,
    });
  }
}
