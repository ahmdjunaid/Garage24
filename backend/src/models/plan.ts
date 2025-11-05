import mongoose, { Schema } from "mongoose";
import { IPlan } from "../types/plan";

const planSchema = new Schema<IPlan>(
  {
    name: { type: String, required: true },
    price: { type: Number , required: true },
    validity: { type: Number , required: true },
    noOfMechanics: { type: Number , required: true },
    noOfServices: { type: Number , required: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type PlanDocument = IPlan & Document;
export const Plan = mongoose.model<IPlan>("Plan", planSchema);