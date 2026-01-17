import { BaseRepository } from "../../IBaseRepository";
import { ISubscriptionRepository } from "../interface/ISubscriptionRepository";
import { Types } from "mongoose";
import { ISubscription } from "../../../types/subscription";
import subscription from "../../../models/subscription";
import { injectable } from "inversify";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor() {
    super(subscription);
  }
  async upsertSubscription(data: Partial<ISubscription>) {
    const update = {
      $set: {
        startDate: data.startDate,
        expiryDate: data.expiryDate,
        sessionId: data.sessionId,
        garageId: new Types.ObjectId(data.garageId!),
        planId: new Types.ObjectId(data.planId!),
        planSnapShot: data.planSnapShot
      },
    };

    return await this.model.findOneAndUpdate(
      { paymentIntent: data.paymentIntent },
      update,
      {
        upsert: true,
        new: true,
      }
    );
  }

  async getSubscriptionByGarageId(
    garageId: string
  ) {
    return await this.getByFilter({
      garageId,
      expiryDate: { $gt: new Date() },
    });
  }

  async upsertSubscriptionByPaymentIntent(
    paymentIntent: Partial<ISubscription>,
    data: Partial<ISubscription>
  ): Promise<ISubscription | null> {
    return await this.model.findOneAndUpdate(
      paymentIntent,
      {
        $set: data,
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
}
