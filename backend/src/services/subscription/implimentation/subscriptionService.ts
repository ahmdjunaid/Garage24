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
import mongoose, { Types } from "mongoose";
import { IPlanRepository } from "../../../repositories/plan/interface/IPlanRepository";
import { PaymentStatus } from "../../../types/payments";
import { AppError } from "../../../middleware/errorHandler";
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

  async subscribePlan(data: {
    garageId: string;
    planId: string;
    planName: string;
    planPrice: string;
  }): Promise<{ url: string }> {
    const futureSubs =
      await this._subscriptionRepository.getFutureSubscriptions(data.garageId);

    if (futureSubs.length >= 1)
      throw new AppError(HttpStatus.BAD_REQUEST, RENEWAL_POLICY_VIOLATION);

    const planAlreadyExist =
      await this._subscriptionRepository.getSubscriptionByGarageId(
        data.garageId
      );

    if (
      planAlreadyExist &&
      calculateDaysLeft(planAlreadyExist.expiryDate) > 7 &&
      planAlreadyExist.planId !== new Types.ObjectId(data.planId)
    ) {
      throw new AppError(HttpStatus.BAD_REQUEST, RENEWAL_POLICY_VIOLATION);
    }

    return await this._stripeService.createCheckoutSession({
      currency: "inr",
      amount: Number(data.planPrice),
      productName: data.planName,
      metadata: {
        paymentPurpose: "SUBSCRIPTION",
        garageId: data.garageId,
        productId: data.planId,
        productName: data.planName,
      },
      successUrl: `${process.env.CLIENT_URL}/garage/plans?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.CLIENT_URL}/garage/plans?payment=failed`,
    });
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

    const planAlreadyExist =
      await this._subscriptionRepository.getSubscriptionByGarageId(garageId);

    const garageIdConverted = new mongoose.Types.ObjectId(garageId);
    const planIdConverted = new mongoose.Types.ObjectId(planId);

    const plan = await this._planRepository.getPlanById(planId);

    if (!plan) {
      throw new AppError(HttpStatus.NOT_FOUND, PLAN_NOT_FOUND);
    }
    const baseDate = planAlreadyExist
      ? new Date(planAlreadyExist.expiryDate)
      : new Date();

    const expiryDate = new Date(baseDate);
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
      startDate: baseDate,
      expiryDate,
      sessionId,
      paymentIntent,
      status: planAlreadyExist ? "pending" : "active",
    });

    return {
      message: planAlreadyExist
        ? "Plan renewed successfully"
        : "Subscription activated successfully",
    };
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

  async activePendingSubscriptions(): Promise<void> {
    const now = new Date();

    const pendingSubs =
      await this._subscriptionRepository.findPendingToActivate(now);

    for (const sub of pendingSubs) {
      await this._subscriptionRepository.expireSubsByUserId(sub.garageId);

      await this._subscriptionRepository.activatePendingSubs(sub._id);
    }
  }
}
