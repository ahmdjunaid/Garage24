import { Types } from "mongoose";
import { PaymentStatus } from "./payments";

export interface planSnapShot {
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
}

export interface ISubscription {
  garageId: Types.ObjectId;
  planId: Types.ObjectId;
  planSnapShot: planSnapShot;
  startDate: Date;
  expiryDate: Date;
  status: "pending" | "active" | "expired" | "cancelled";
  paymentStatus: PaymentStatus;
  sessionId: string;
  paymentIntent: string;
}

export interface IRetriveSessionData {
    transactionId: string | null;
    productName: string;
    amountPaid: number;
    paymentMethod: string;
    currency: string;
    date: Date;
    receipt_url: string | null;
}


export interface ICheckoutSession {
  amount: number;
  currency?: string;
  productName: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}