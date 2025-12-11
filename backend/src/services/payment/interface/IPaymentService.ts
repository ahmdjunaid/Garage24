import { Types } from "mongoose";
import { BillType, PaymentStatus } from "../../../types/payments";

export default interface IPaymentService {
  create(data: {
    userId: Types.ObjectId;
    paymentIntentId: string;
    provider: "stripe";
    BillType: BillType;
    referenceId: Types.ObjectId;
    amount: number;
    status: PaymentStatus;
  }): Promise<{ message: string }>;
}
