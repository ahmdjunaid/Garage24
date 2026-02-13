import { PaymentStatus } from "../../../types/payments";
import { ISubscription } from "../../../types/subscription";

export default interface ISubscriptionService {
  subscribePlan(data:{
    garageId: string,
    planId: string,
    planName: string,
    planPrice: string
  }): Promise<{ url: string }>;
  upsertPlanData(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string | null
  ): Promise<{ message: string }>;

  upsertPaymentStatus(
    paymentIntent: string,
    paymentStatus: PaymentStatus
  ): Promise<ISubscription | null>;
  activePendingSubscriptions(): Promise<void>;
}
