import { Types } from "mongoose";
import { SubscriptionDocument } from "../../../models/subscription";
import { ISubscription } from "../../../types/subscription";
import { DashboardAggregationResult } from "../../../types/dashboard";

export interface ISubscriptionRepository {
  createSubscription(data: Partial<ISubscription>): Promise<ISubscription | null>;
  getSubscriptionByGarageId(garageId: string): Promise<SubscriptionDocument | null>;
  getFutureSubscriptions(garageId: string): Promise<SubscriptionDocument[]>
  upsertSubscriptionByPaymentIntent(paymentIntent:Partial<ISubscription>, data:Partial<ISubscription>): Promise<ISubscription | null>;
  findPendingToActivate(date:Date): Promise<SubscriptionDocument[]>;
  activatePendingSubs(id:Types.ObjectId):Promise<SubscriptionDocument|null>;
  expireSubsByUserId(userId:Types.ObjectId):Promise<void>
  aggregateDashboardData(start: Date, end: Date, type: "week" | "month" | "year"): Promise<DashboardAggregationResult>
}