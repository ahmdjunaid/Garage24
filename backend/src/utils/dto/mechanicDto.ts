import { ObjectId } from "mongoose";
import { UserDocument } from "../../models/user";
import { IMechanicMappedData } from "../../types/mechanic";

export interface populatedMechanic {
  name: string;
  garageId: ObjectId;
  userId: UserDocument;
  skills: string[];
  imageUrl: string;
  mobileNumber: string;
  isDeleted: boolean;
  isBlocked: boolean;
}

export const mechanicDataMapping = (mechanics: populatedMechanic): IMechanicMappedData => {
  const userDetails = mechanics.userId;
  return {
    userId: userDetails._id.toString(),
    mechanicId: userDetails.Id,
    name: userDetails.name,
    email: userDetails.email,
    isBlocked: userDetails.isBlocked,
    isOnboardingRequired: userDetails.isOnboardingRequired!,
    role: userDetails.role,
    skills: mechanics?.skills,
    imageUrl: mechanics?.imageUrl,
    mobileNumber: mechanics?.mobileNumber,
  };
};
