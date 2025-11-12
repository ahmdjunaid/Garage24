import { ObjectId } from "mongodb";

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

export interface IPlanSnapshot {
  name: string;
  price: number;
  validity: number;
  noOfMechanics: number;
  noOfServices: number;
  purchasedAt: Date;
  expiresAt: Date;
}

export interface IGarage {
  name: string;
  userId: ObjectId;
  location: ILocation;
  address: IAddress;
  plan?: IPlanSnapshot[];
  startTime: string;
  endTime: string;
  selectedHolidays: string[];
  imageUrl: string;
  docUrl: string;
  mobileNumber: string;
  isRSAEnabled: boolean;
  isDeleted?: boolean;
  approvalStatus?: approvalStatus;
}

export interface GetMappedGarageResponse{
  garages:IGarage[]
  totalGarages: number;
  totalPages: number;
}

export interface GarageStatusResponse {
  hasGarage: boolean;
  approvalStatus: string | undefined;
  hasActivePlan: boolean | undefined
}