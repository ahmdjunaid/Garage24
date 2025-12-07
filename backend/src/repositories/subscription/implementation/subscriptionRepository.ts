import { BaseRepository } from "../../IBaseRepository";
import { ISubscriptionRepository } from "../interface/ISubscriptionRepository";
import { Types } from "mongoose";
import { ISubscription } from "../../../types/subscription";
import subscription from "../../../models/subscription";

export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor() {
    super(subscription);
  }
  async create(SubscriptionData: Partial<ISubscription>) {
    const subscriptionToSave = {
      garageId: new Types.ObjectId(SubscriptionData.garageId),
      planId: new Types.ObjectId(SubscriptionData.planId),
      startDate: SubscriptionData.startDate,
      expiryDate: SubscriptionData.expiryDate,
      sessionId: SubscriptionData.sessionId,
      paymentIntent: SubscriptionData.paymentIntent,
      paymentStatus: SubscriptionData.paymentStatus
    };

    return await this.model.create(subscriptionToSave);
  }

  async getSubscriptionByGarageId(
    garageId: string
  ): Promise<ISubscription | null> {
    return await this.getByFilter({
      garageId,
      expiryDate: { $gt: new Date() },
    });
  }

  async updateSubscriptionByPaymentIntent(
    paymentIntent: string,
    data: Partial<ISubscription>
  ): Promise<ISubscription | null> {
    return await this.updateOneByFilter({paymentIntent:paymentIntent}, data);
  }
}
