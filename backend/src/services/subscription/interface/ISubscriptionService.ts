import { PaymentStatus } from "../../../types/payments";
import { ICheckoutSession } from "../../../types/plan";
import { ISubscription } from "../../../types/subscription";

export default interface ISubscriptionService {
  subscribePlan(data: ICheckoutSession):Promise<{ url: string }>;
  upsertPlanData(
    garageId: string,
    planId: string,
    sessionId: string,
    paymentIntent: string | null,
  ): Promise<{ message: string; }>;

  upsertPaymentStatus(paymentIntent:string, paymentStatus: PaymentStatus):Promise<ISubscription | null>
}