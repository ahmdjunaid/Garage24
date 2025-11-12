import { ObjectId } from "mongoose";
import { IAddress, ILocation } from "../../types/garage";

export interface IMappedGarageData {
  _id: string;
  userId: ObjectId;
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
  docUrl?: string;
  mobileNumber?: string;
  isRSAEnabled?: boolean;
  approvalStatus?: string;
}

export const garageDataMapping = (garage: any): IMappedGarageData => {
  const garageDetails = garage.userId;
  return {
    _id: garageDetails._id,
    userId: garageDetails.Id,
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
    docUrl: garage?.docUrl,
    mobileNumber: garage?.mobileNumber,
    isRSAEnabled: garage?.isRSAEnabled,
    approvalStatus: garage?.approvalStatus,
  };
};
