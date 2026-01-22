import ISubscriptionService from "../interface/ISubscriptionService";
import { ISubscriptionRepository } from "../../../repositories/subscription/interface/ISubscriptionRepository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_PLAN_UPDATE,
  PLAN_NOT_FOUND,
  RENEWAL_POLICY_VIOLATION,
  SUBSCRIPTION_ERROR,
} from "../../../constants/messages";
import mongoose from "mongoose";
import { IPlanRepository } from "../../../repositories/plan/interface/IPlanRepository";
import { PaymentStatus } from "../../../types/payments";
import { AppError } from "../../../middleware/errorHandler";
import { ICheckoutSession } from "../../../types/plan";
import { calculateDaysLeft } from "../../../utils/calculateDaysLeft";
import IStripeService from "../../stripe/interface/IStripeService";

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository,
    @inject(TYPES.StripeService) private _stripeService: IStripeService
  ) {}

  async subscribePlan(data: ICheckoutSession): Promise<{ url: string }> {
    const planAlreadyExist =
      await this._subscriptionRepository.getSubscriptionByGarageId(
        data.garageId
      );

    if(planAlreadyExist && calculateDaysLeft(planAlreadyExist.expiryDate) > 7){
      throw new AppError(HttpStatus.BAD_REQUEST, RENEWAL_POLICY_VIOLATION)
    }

    return await this._stripeService.createSubscribeSession(data)
  }

  async upsertPlanData(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string
  ) {
    if (!garageId || !planId || !sessionId || !paymentIntent) {
      throw new AppError(HttpStatus.BAD_REQUEST, SUBSCRIPTION_ERROR);
    }

    const garageIdConverted = new mongoose.Types.ObjectId(garageId);
    const planIdConverted = new mongoose.Types.ObjectId(planId);

    const plan = await this._planRepository.getPlanById(planId);

    if (!plan) {
      throw new AppError(HttpStatus.NOT_FOUND, PLAN_NOT_FOUND);
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.validity);

    const planSnapShot = {
      name: plan.name,
      price: plan.price,
      validity: plan.validity,
      noOfMechanics: plan.noOfMechanics,
      noOfServices: plan.noOfServices,
    };

    await this._subscriptionRepository.upsertSubscription({
      garageId: garageIdConverted,
      planId: planIdConverted,
      planSnapShot,
      startDate: new Date(),
      expiryDate,
      sessionId,
      paymentIntent,
      status: "pending",
    });

    return { message: "Successfully subscribed" };
  }

  async upsertPaymentStatus(
    paymentIntent: string,
    paymentStatus: PaymentStatus
  ) {
    const updatedSubscription =
      await this._subscriptionRepository.upsertSubscriptionByPaymentIntent(
        { paymentIntent },
        { paymentStatus }
      );
    if (!updatedSubscription) {
      throw new AppError(HttpStatus.BAD_REQUEST, ERROR_WHILE_PLAN_UPDATE);
    }

    return updatedSubscription;
  }
}
