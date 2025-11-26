import { Types } from "mongoose";

export interface IPaymentHistory {
  amount: number;
  transactionId: string;
  date: Date;
  status: "success" | "failed" | "pending";
  reason: string | null;
}

export interface ISubscription extends Document {
  garageId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  expiryDate: Date;
  status: "pending" | "active" | "expired" | "cancelled";
  transactionId?: string;
  paymentHistory: IPaymentHistory
}

export interface IRetriveSessionData {
    transactionId: string | null;
    planName: string;
    amountPaid: number;
    paymentMethod: string;
    currency: string;
    date: Date;
    receipt_url: string | null;
}