import { HydratedDocument, Schema, model } from "mongoose";
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
    sessionId: {
      type: String,
      default: null,
    },
    paymentIntent: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", 'refunded'],
      default: "pending",
    },
  },
  { timestamps: true }
);

export type SubscriptionDocument = HydratedDocument<ISubscription>;
export default model<ISubscription>("Subscription", subscriptionSchema);