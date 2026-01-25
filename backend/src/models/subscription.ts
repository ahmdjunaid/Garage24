import { HydratedDocument, Schema, model } from "mongoose";
import { ISubscription } from "../types/subscription";

const subscriptionSchema = new Schema<ISubscription>(
  {
    garageId: {
      type: Schema.Types.ObjectId,
      ref: "Garage",
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },
    planSnapShot: {
      name: { type: String },
      price: { type: String },
      validity: { type: String },
      noOfMechanics: { type: String },
      noOfServices: { type: String }
    },
    startDate: {
      type: Date,
    },
    expiryDate: {
      type: Date,
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
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ status:1, startDate:1, expiryDate: 1 });

export type SubscriptionDocument = HydratedDocument<ISubscription>;
export default model<ISubscription>("Subscription", subscriptionSchema);
