import { ISubscription } from "../../../types/subscription";

export interface ISubscriptionRepository {
  create(SubscriptionData: Partial<ISubscription>): Promise<ISubscription>;
  getSubscriptionByGarageId(garageId: string): Promise<ISubscription | null>;
  updateSubscriptionByPaymentIntent(paymentIntent:string, data:Partial<ISubscription>): Promise<ISubscription | null>;
}