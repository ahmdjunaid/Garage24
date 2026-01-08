import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IVehicleModel {
  name: string;
  brandId: Types.ObjectId;
  isDeleted: boolean;
  isBlocked: boolean;
}

const vehicleModelSchema = new Schema<IVehicleModel>({
  name: { type: String, required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "Brand" },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
},{
   timestamps: true
});

export type VechicleModelDocument = HydratedDocument<IVehicleModel>;
export const VehicleModel = mongoose.model<IVehicleModel>("VehicleModel", vehicleModelSchema)