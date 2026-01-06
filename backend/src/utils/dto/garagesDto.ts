import { IAddress, ILocation, IPopulatedGarage } from "../../types/garage";

export interface IMappedGarageData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  location?: ILocation;
  address?: IAddress;
  startTime?: string;
  endTime?: string;
  selectedHolidays?: string[];
  imageUrl?: string;
  docUrl?: string;
  mobileNumber?: string;
  isRSAEnabled?: boolean;
  approvalStatus?: string;
  rejectionReason?: string; 
}

export const garageDataMapping = (garage: IPopulatedGarage): IMappedGarageData => {
  const garageDetails = garage.userId;
  return {
    _id: garageDetails._id.toString(),
    userId: garageDetails.Id,
    name: garageDetails.name,
    email: garageDetails.email,
    role: garageDetails.role,
    isBlocked: garageDetails.isBlocked,
    location: garage?.location,
    address: garage?.address,
    startTime: garage?.startTime,
    endTime: garage?.endTime,
    selectedHolidays: garage?.selectedHolidays,
    imageUrl: garage?.imageUrl,
    docUrl: garage?.docUrl,
    mobileNumber: garage?.mobileNumber,
    isRSAEnabled: garage?.isRSAEnabled,
    approvalStatus: garage?.approvalStatus,
    rejectionReason: garage?.rejectionReason
  };
};
