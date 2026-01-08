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

@injectable()
export class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.SubscriptionRepository)
    private _subscriptionRepository: ISubscriptionRepository,
    @inject(TYPES.PlanRepository) private _planRepository: IPlanRepository
  ) {}
  async upsertPlanData(
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
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_PLAN_UPDATE,
      };
    }

    return updatedSubscription;
  }
}
