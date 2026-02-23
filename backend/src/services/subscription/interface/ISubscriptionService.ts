// import { PaymentStatus } from "../../../types/payments";
// import { ISubscription } from "../../../types/subscription";

import { PaymentStatus } from "../../../types/payments";

export default interface ISubscriptionService {
  subscribePlan(data:{
    garageId: string,
    planId: string,
    planName: string,
    planPrice: string
  }): Promise<{ url: string }>;
  createPlanData(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string | null,
    paymentStatus: PaymentStatus
  ): Promise<{ message: string }>;

  activePendingSubscriptions(): Promise<void>;
}
