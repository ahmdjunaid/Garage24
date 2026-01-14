import { ObjectId } from "mongodb";
import { IUser } from "./user";
import { Types } from "mongoose";

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export type approvalStatus = "pending" | "approved" | "rejected";

export interface IAddress {
  city: { type: string };
  district: { type: string }
  state: { type: string };
  pincode: { type: string };
}

export interface IGarage {
  name: string;
  userId: ObjectId;
  location: ILocation;
  address: IAddress;
  startTime: string;
  endTime: string;
  selectedHolidays: string[];
  imageUrl: string;
  docUrl: string;
  mobileNumber: string;
  isRSAEnabled: boolean;
  isDeleted?: boolean;
  isBlocked?: boolean;
  approvalStatus?: approvalStatus;
  rejectionReason?: string;
  numOfServiceBays: number;
  supportedFuelTypes: string[];
}

export interface IPopulatedGarage {
  name: string;
  userId: IUser & Document & { _id: Types.ObjectId }; 
  location: ILocation;
  address: IAddress;
  startTime: string;
  endTime: string;
  selectedHolidays: string[];
  imageUrl: string;
  docUrl: string;
  mobileNumber: string;
  isRSAEnabled: boolean;
  isDeleted: boolean;
  isBlocked: boolean;
  approvalStatus?: approvalStatus;
  rejectionReason?: string; 
  numOfServiceBays: number;
  supportedFuelTypes: string[];
}

export interface GetMappedGarageResponse{
  garages:IGarage[]
  totalGarages: number;
  totalPages: number;
}

export interface GarageStatusResponse {
  hasGarage: boolean;
  approvalStatus: string | undefined;
}