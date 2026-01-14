import type { IPlan } from "./PlanTypes";

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IAddress {
  city: { type: string };
  district: { type: string };
  state: { type: string };
  pincode: { type: string };
}

export type approvalStatus = "pending" | "approved" | "rejected";

export interface ApprovalPayload {
  id: string;
  name: string;
  action: approvalStatus;
}

export interface IMappedGarageData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  location?: ILocation;
  address?: IAddress;
  plan?: Partial<IPlan>;
  startTime?: string;
  endTime?: string;
  selectedHolidays?: string[];
  imageUrl?: string;
  mobileNumber?: string;
  isRSAEnabled?: boolean;
  approvalStatus?: approvalStatus;
  numOfServiceBays: number;
  supportedFuelTypes: string[];
}

export interface GarageData {
  _id: string;
  userId: string;
  name: string;
  mobileNumber: string;
  startTime: string;
  endTime: string;
  address: {
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
  location: {
    coordinates: [number, number];
    type: string;
  };
  approvalStatus: string;
  isRSAEnabled: boolean;
  imageUrl: string;
  docUrl: string;
  selectedHolidays: string[];
  numOfServiceBays: number;
  supportedFuelTypes: string[];
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}
