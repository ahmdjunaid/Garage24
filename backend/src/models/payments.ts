import { Schema, model, HydratedDocument } from "mongoose";
import { IPayment } from "../types/payments";


const paymentSchema = new Schema<IPayment>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["stripe"],
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    paymentIntentId: {
      type: String,
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    BillType: {
      type: String,
      enum: ["subscription", "service"],
      required: true,
      index: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
      index: true,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>("Payment", paymentSchema);
export type PaymentDocument = HydratedDocument<IPayment>;