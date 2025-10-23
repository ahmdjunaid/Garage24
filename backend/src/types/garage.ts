import { ObjectId } from "mongodb";

export interface ILocation {
  type: "Point";
  coordinates: [number, number];
}

export interface IAddress {
  city: { type: string };
  district: { type: string }
  state: { type: string };
  pincode: { type: string };
}

export interface IGarage {
  name: string;
  garageId: ObjectId;
  location: ILocation;
  address: IAddress;
  plan: string;
  startTime: string;
  endTime: string;
  selectedHolidays: string[];
  imageUrl: string;
  mobileNumber: string;
  isRSAEnabled: boolean;
}

export interface GetMappedGarageResponse{
  garages:IGarage[]
  totalGarages: number;
  totalPages: number;
}