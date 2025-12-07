import { ISubscription } from "../../../types/subscription";

export interface ISubscriptionRepository {
  upsertSubscription(data: Partial<ISubscription>): Promise<ISubscription | null>;
  getSubscriptionByGarageId(garageId: string): Promise<ISubscription | null>;
  upsertSubscriptionByPaymentIntent(paymentIntent:string, data:Partial<ISubscription>): Promise<ISubscription | null>;
}