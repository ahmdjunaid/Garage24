import ISubscriptionService from "../interface/ISubscriptionService";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_PLAN_UPDATE,
  PLAN_NOT_FOUND,
  SUBSCRIPTION_ERROR,
} from "../../../constants/messages";
import mongoose from "mongoose";
import { IPlanRepository } from "../../../repositories/plan/interface/IPlanRepository";
import { PaymentStatus } from "../../../types/payments";
import { ISubscription } from "../../../types/subscription";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository
  ) {}
  async subscribePlan(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string
  ) {
    if (!garageId || !planId || !sessionId) {
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
      sessionId,
      paymentIntent,
      status: "pending",
      paymentStatus: "paid"
    });

    return { message: "Successfully subscribed" };
  }

  async updatePaymentStatus(
    paymentIntent: string,
    paymentStatus: PaymentStatus
  ) {
    console.log(paymentIntent, paymentStatus,'///////////')
    const updatedSubscription =
      await this._subscriptionRepository.updateSubscriptionByPaymentIntent(
        paymentIntent,
        { paymentStatus }
      );
console.log(updatedSubscription,'123455')
    if(!updatedSubscription){
      throw {status: HttpStatus.BAD_REQUEST, message: ERROR_WHILE_PLAN_UPDATE}
    }

    return updatedSubscription
  }
}
