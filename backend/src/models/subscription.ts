import { Schema, model } from "mongoose";
import { ISubscription } from "../types/subscription";

const subscriptionSchema = new Schema<ISubscription>(
  {
    garageId: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
      required: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentHistory:{
        amount: { type: Number, required: true },
        transactionId: { type: String, required: true },
        date: { type: Date, default: Date.now },
        status: { type: String, enum: ["success", "failed", "pending"] },
        reason: { type: String, default: null },
      },
  },
  { timestamps: true }
);

export default model<ISubscription>("Subscription", subscriptionSchema);