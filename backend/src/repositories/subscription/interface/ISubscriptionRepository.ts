import { ISubscription } from "../../../types/subscription";

export interface ISubscriptionRepository {
  create(SubscriptionData: Partial<ISubscription>): Promise<ISubscription>;
  getSubscriptionByGarageId(garageId: string): Promise<ISubscription | null>
}