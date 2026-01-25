import { Types } from "mongoose";
import { SubscriptionDocument } from "../../../models/subscription";
import { ISubscription } from "../../../types/subscription";

export interface ISubscriptionRepository {
  upsertSubscription(data: Partial<ISubscription>): Promise<ISubscription | null>;
  getSubscriptionByGarageId(garageId: string): Promise<SubscriptionDocument | null>;
  getFutureSubscriptions(garageId: string): Promise<SubscriptionDocument[]>
  upsertSubscriptionByPaymentIntent(paymentIntent:Partial<ISubscription>, data:Partial<ISubscription>): Promise<ISubscription | null>;
  findPendingToActivate(date:Date): Promise<SubscriptionDocument[]>;
  activatePendingSubs(id:Types.ObjectId):Promise<SubscriptionDocument|null>;
  expireSubsByUserId(userId:Types.ObjectId):Promise<void>
}