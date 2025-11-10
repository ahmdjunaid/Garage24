import { ObjectId } from "mongoose";
import { IAddress, ILocation } from "../../types/garage";

export interface IMappedGarageData {
  _id: string;
  garageId: ObjectId;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  location?: ILocation;
  address?: IAddress;
  plan?: string;
  startTime?: string;
  endTime?: string;
  selectedHolidays?: string[];
  imageUrl?: string;
  mobileNumber?: string;
  isRSAEnabled?: boolean;
  isApproved?: boolean;
}

export const garageDataMapping = (garage: any): IMappedGarageData => {
  const garageDetails = garage.garageId;
  return {
    _id: garageDetails._id,
    garageId: garageDetails.Id,
    name: garageDetails.name,
    email: garageDetails.email,
    role: garageDetails.role,
    isBlocked: garageDetails.isBlocked,
    location: garage?.location,
    address: garage?.address,
    plan: garage?.plan?.name,
    startTime: garage?.startTime,
    endTime: garage?.endTime,
    selectedHolidays: garage?.selectedHolidays,
    imageUrl: garage?.imageUrl,
    mobileNumber: garage?.mobileNumber,
    isRSAEnabled: garage?.isRSAEnabled,
    isApproved: garage?.isApproved,
  };
};
