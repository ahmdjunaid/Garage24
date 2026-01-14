import mongoose, { Schema, HydratedDocument } from "mongoose";
import { IVehicle } from "../types/vehicle";


const vehicleSchema = new Schema<IVehicle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    licensePlate: { type: String, required: true, uppercase: true, unique: true },
    make: { type: Schema.Types.ObjectId, ref: "Brand", required: true },
    model: { type: Schema.Types.ObjectId, ref: "VehicleModel", required: true },
    registrationYear: { type: Number, required: true, min: 1950 },
    fuelType: { type: String, required: true, enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"] },
    variant: { type: String, trim: true },
    color: { type: String, required: true, trim: true },
    imageUrl: { type: String },
    insuranceValidity: { type: Date, required: true },
    puccValidity: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
    lastServicedKM: { type: String },
},
{ timestamps: true }
);

export type VehicleDocument = HydratedDocument<IVehicle>;
export const Vehicle = mongoose.model<IVehicle>("Vehicle", vehicleSchema);