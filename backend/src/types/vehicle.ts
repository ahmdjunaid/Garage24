import { Types } from "mongoose";

export interface IVehicle {
  userId: Types.ObjectId;
  licensePlate: string;
  make: string;
  model: string;
  registrationYear: number;
  fuelType: string;
  variant?: string;
  color?: string;
  imageUrl?: string;
  insuranceValidity: Date;
  puccValidity: Date;
  isDeleted?: boolean;
}
