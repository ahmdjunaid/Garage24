import { BaseRepository } from "../../IBaseRepository";
import { ISubscriptionRepository } from "../interface/ISubscriptionRepository";
import { Types } from "mongoose";
import { ISubscription } from "../../../types/subscription";
import { injectable } from "inversify";
import subscription, {
  SubscriptionDocument,
} from "../../../models/subscription";
import { DashboardAggregationResult } from "../../../types/dashboard";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository
{
  constructor() {
    super(subscription);
  }
  async createSubscription(data: Partial<ISubscription>) {
    const update = {
      $set: {
        startDate: data.startDate,
        expiryDate: data.expiryDate,
        sessionId: data.sessionId,
        garageId: new Types.ObjectId(data.garageId!),
        planId: new Types.ObjectId(data.planId!),
        planSnapShot: data.planSnapShot,
        status: data.status,
        paymentStatus: data.paymentStatus
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

  async getSubscriptionByGarageId(garageId: string) {
    return await this.getByFilter({
      garageId,
      expiryDate: { $gt: new Date() },
      status: "active",
    });
  }

  async getFutureSubscriptions(
    garageId: string
  ): Promise<SubscriptionDocument[]> {
    return await this.model.find({
      garageId,
      expiryDate: { $gt: new Date() },
      status: "pending",
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

  async findPendingToActivate(date: Date): Promise<SubscriptionDocument[]> {
    return await this.model.find({
      status: "pending",
      startDate: { $lte: date },
    });
  }

  async activatePendingSubs(
    id: Types.ObjectId
  ): Promise<SubscriptionDocument | null> {
    return await this.model.findByIdAndUpdate(id, {
      $set: { status: "active" },
    });
  }

  async expireSubsByUserId(garageId: Types.ObjectId): Promise<void> {
    await this.model.updateMany(
      { garageId, status: "active" },
      { status: "expired" }
    );
  }

  async aggregateDashboardData(
    start: Date,
    end: Date,
    type: "week" | "month" | "year"
  ): Promise<DashboardAggregationResult> {
    const groupFormat =
      type === "year"
        ? { $month: "$createdAt" }
        : type === "month"
          ? { $dayOfMonth: "$createdAt" }
          : { $dayOfWeek: "$createdAt" };

    const result = await this.model.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $facet: {
          revenue: [
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $toDouble: {
                      $ifNull: ["$planSnapShot.price", "0"],
                    },
                  },
                },
              },
            },
          ],
          chart: [
            {
              $group: {
                _id: groupFormat,
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    return result[0];
  }
}
