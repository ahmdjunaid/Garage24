import { PaymentStatus } from "../../../types/payments";
import { ISubscription } from "../../../types/subscription";

export default interface ISubscriptionService {
  subscribePlan(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string | null,
  ): Promise<{ message: string; }>;

  updatePaymentStatus(paymentIntent:string, paymentStatus: PaymentStatus):Promise<ISubscription | null>
}