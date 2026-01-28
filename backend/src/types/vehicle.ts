import { Types } from "mongoose";
import { VehicleDocument } from "../models/vehicle";

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

export interface IPopulatedVehicle extends Omit<VehicleDocument, "make" | "model"> {
  make: {
    _id: Types.ObjectId;
    name: string;
  },
  model: {
    _id: Types.ObjectId;
    name: string;
  }
}

export interface VehiclePayload {
  _id?: string;

  licensePlate: string;
  registrationYear?: number;
  fuelType?: string;
  variant?: string;
  color?: string;
  imageUrl?: string;

  make: {
    _id: string;
    name: string;
  };

  model: {
    _id: string;
    name: string;
  };
}
