import { Types } from "mongoose";
import { BillType, PaymentStatus } from "../../../types/payments";
import Stripe from "stripe";
import { PaymentDocument } from "../../../models/payments";

export default interface IPaymentService {
  createPayment(data: {
    userId: Types.ObjectId;
    paymentIntentId: string;
    provider: "stripe";
    BillType: BillType;
    referenceId: Types.ObjectId;
    amount: number;
    status: PaymentStatus;
  }): Promise<PaymentDocument>;
  handleWebhookEvent(event: Stripe.Event): Promise<void>;
}
