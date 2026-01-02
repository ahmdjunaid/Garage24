import { Schema, model } from "mongoose";
import { IService } from "../types/services";

const garageServiceSchema = new Schema<IService>(
  {
    garageId: { type: Schema.Types.ObjectId, ref: "Garage", required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Service = model<IService>("GarageService",garageServiceSchema);