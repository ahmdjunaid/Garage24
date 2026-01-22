import { Types } from "mongoose";
import { BillType, PaymentStatus } from "../../../types/payments";
import Stripe from "stripe";

export default interface IPaymentService {
  createPayment(data: {
    userId: Types.ObjectId;
    paymentIntentId: string;
    provider: "stripe";
    BillType: BillType;
    referenceId: Types.ObjectId;
    amount: number;
    status: PaymentStatus;
  }): Promise<{ message: string }>;
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
}
