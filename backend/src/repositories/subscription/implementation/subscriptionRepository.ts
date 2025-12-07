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
  async upsertSubscription(data: Partial<ISubscription>) {
    const subscriptionToSave = {
      garageId: new Types.ObjectId(data.garageId),
      planId: new Types.ObjectId(data.planId),
      startDate: data.startDate,
      expiryDate: data.expiryDate,
      sessionId: data.sessionId,
    };

    return await this.model.findOneAndUpdate(
      { paymentIntent: data.paymentIntent },
      subscriptionToSave,
      { upsert: true }
    );
  }

  async getSubscriptionByGarageId(
    garageId: string
  ): Promise<ISubscription | null> {
    return await this.getByFilter({
      garageId,
      expiryDate: { $gt: new Date() },
    });
  }

  async upsertSubscriptionByPaymentIntent(
    paymentIntent: string,
    data: Partial<ISubscription>
  ): Promise<ISubscription | null> {
    return await this.model.findOneAndUpdate({ paymentIntent }, data, {
      upsert: true,
    });
  }
}
