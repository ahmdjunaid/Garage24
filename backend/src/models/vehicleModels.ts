import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IVehicleModels {
  name: string;
  brandId: Types.ObjectId;
  isDeleted: boolean;
  isBlocked: boolean;
}

const vehicleModelSchema = new Schema<IVehicleModels>({
  name: { type: String, required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
},{
   timestamps: true
});

export type VechicleModelDocument = HydratedDocument<IVehicleModels>;
export const VehicleModel = mongoose.model<IVehicleModels>("VehicleModel", vehicleModelSchema)

