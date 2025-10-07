import mongoose, { Schema } from "mongoose";
import { IGarage } from "../types/garage";

// Schema
const garageSchema = new Schema<IGarage>(
  {
    garageId: { type: Schema.Types.ObjectId, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    plan: {type: String, required: true},
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    selectedHolidays: { type: [String], required: true},
    imageUrl: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    isRSAEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Garage = mongoose.model<IGarage>("Garage", garageSchema);
