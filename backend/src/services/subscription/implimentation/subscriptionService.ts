import ISubscriptionService from "../interface/ISubscriptionService";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  PLAN_NOT_FOUND,
  SUBSCRIPTION_ERROR,
} from "../../../constants/messages";
import mongoose from "mongoose";
import { IPlanRepository } from "../../../repositories/plan/interface/IPlanRepository";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository
  ) {}
  async subscribePlan(garageId: string, planId: string, transactionId: string) {
    if (!garageId || !planId || !transactionId) {
      throw { status: HttpStatus.BAD_REQUEST, message: SUBSCRIPTION_ERROR };
    }
    const garageIdConverted = new mongoose.Types.ObjectId(garageId);
    const planIdConverted = new mongoose.Types.ObjectId(planId);

    const plan = await this._planRepository.getPlanById(planId);

    if (!plan) {
      throw { status: HttpStatus.NOT_FOUND, message: PLAN_NOT_FOUND };
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.validity);

    await this._subscriptionRepository.create({
      garageId: garageIdConverted,
      planId: planIdConverted,
      startDate: new Date(),
      expiryDate,
      transactionId,
      status: "active",
      paymentHistory:
        {
          amount: plan.price,
          transactionId,
          date: new Date(),
          status: "success",
          reason: null
        },
    });

    return {message: "Successfully subscribed"}
  }
}
