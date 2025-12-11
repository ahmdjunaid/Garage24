import { ObjectId } from "mongodb";

export interface IMechanic {
  name: string;
  garageId: ObjectId;
  userId: ObjectId;
  skills: string[];
  imageUrl: string;
  mobileNumber: string;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface GetMechanicResponse{
  mechanics:IMechanic[]
  totalMechanics: number;
  totalPages: number;
}

export interface IMechanicMappedData {
  userId: string;
  mechanicId: string;
  name: string;
  email: string;
  isBlocked: boolean;
  isVerified: boolean;
  isOnboardingRequired: boolean;
  role: string;
  skills: string[];
  imageUrl?: string;
  mobileNumber?: string;
}

export interface GetMappedMechanicResponse{
  mechanics: IMechanicMappedData[],
  totalMechanics: number,
  totalPages: number
}
