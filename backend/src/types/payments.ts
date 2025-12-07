import { Types } from "mongoose";

export type PaymentStatus = 
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type BillType =
  | "subscription"
  | "service";

export interface IPayment {
  transactionId: string;
  provider: "stripe";
  sessionId: string;
  paymentIntentId: string;

  userId: Types.ObjectId;
  BillType: BillType
  referenceId?: Types.ObjectId;

  amount: number;
  currency: string;
  status: PaymentStatus;

  createdAt: Date;
  updatedAt: Date;
}
