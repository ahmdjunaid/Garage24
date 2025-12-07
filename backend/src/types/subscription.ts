import { Types } from "mongoose";
import { PaymentStatus } from "./payments";

export interface ISubscription {
  garageId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate: Date;
  expiryDate: Date;
  status: "pending" | "active" | "expired" | "cancelled";
  paymentStatus: PaymentStatus;
  sessionId: string;
  paymentIntent: string;
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