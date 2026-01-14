import { Types } from "mongoose";

export interface IVehicle {
  userId: Types.ObjectId;
  licensePlate: string;
  make: Types.ObjectId;
  model: Types.ObjectId;
  registrationYear: number;
  fuelType: string;
  variant?: string;
  color?: string;
  imageUrl?: string;
  insuranceValidity: Date;
  puccValidity: Date;
  isDeleted?: boolean;
  lastServicedKM: string;
}

export interface IVehiclePopulated {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  licensePlate: string;
  make: { name: string };
  model: { name: string };
  registrationYear: number;
  fuelType: string;
  variant?: string;
  color?: string;
  imageUrl?: string;
  insuranceValidity: Date;
  puccValidity: Date;
  isDeleted?: boolean;
}

export interface IVehicleDTO {
  _id: Types.ObjectId;
  licensePlate: string;
  makeName: string;
  model: string;
  registrationYear: number;
  fuelType: string;
  variant?: string;
  color?: string;
  imageUrl?: string;
  insuranceValidity: Date;
  puccValidity: Date;
}
