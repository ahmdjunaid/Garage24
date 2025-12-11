import { ISubscription } from "../../../types/subscription";

export interface ISubscriptionRepository {
  upsertSubscription(data: Partial<ISubscription>): Promise<ISubscription | null>;
  getSubscriptionByGarageId(garageId: string): Promise<ISubscription | null>;
  upsertSubscriptionByPaymentIntent(paymentIntent:Partial<ISubscription>, data:Partial<ISubscription>): Promise<ISubscription | null>;
}