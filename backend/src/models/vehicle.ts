import mongoose, { Schema, HydratedDocument } from "mongoose";
import { IVehicle } from "../types/vehicle";


const vehicleSchema = new Schema<IVehicle>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    licensePlate: { type: String, required: true, uppercase: true, unique: true },
    make: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    registrationYear: { type: Number, required: true, min: 1950 },
    fuelType: { type: String, required: true, enum: ["Petrol", "Diesel", "Electric", "Hybrid"] },
    variant: { type: String, trim: true },
    color: { type: String, required: true, trim: true },
    imageUrl: { type: String },
    insuranceValidity: { type: Date, required: true },
    puccValidity: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
},
{ timestamps: true }
);

export type VehicleDocument = HydratedDocument<IVehicle>;
export const Vehicle = mongoose.model<IVehicle>("Vehicle", vehicleSchema);