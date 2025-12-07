import { PaymentStatus } from "../../../types/payments";
import { ISubscription } from "../../../types/subscription";

export default interface ISubscriptionService {
  upsertPlanData(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string | null,
  ): Promise<{ message: string; }>;

  upsertPaymentStatus(paymentIntent:string, paymentStatus: PaymentStatus):Promise<ISubscription | null>
}