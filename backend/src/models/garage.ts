import mongoose, { Schema } from "mongoose";
import { IGarage, ILocation } from "../types/garage";

const LocationSchema = new Schema<ILocation>(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  { _id: false }
);

const garageSchema = new Schema<IGarage>(
  {
    name: { type: String, required: true },
    garageId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: { type: LocationSchema, required: true },
    address: {
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    plan: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    selectedHolidays: { type: [String], required: true },
    imageUrl: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    isRSAEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

garageSchema.index({ location: "2dsphere" });

export const Garage = mongoose.model<IGarage>("Garage", garageSchema);
