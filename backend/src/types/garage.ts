import { ObjectId } from "mongodb";

export type Location = {
  lat: number;
  lng: number;
};

export interface IGarage {
  garageId: ObjectId;
  location: Location;
  plan: string;
  startTime: string;
  endTime: string;
  selectedHolidays: string[],
  imageUrl: string;
  mobileNumber: string;
  isRSAEnabled: boolean;
}