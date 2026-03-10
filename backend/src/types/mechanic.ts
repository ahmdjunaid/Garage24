import { Types } from "mongoose";
import { populatedMechanic } from "../utils/dto/mechanicDto";

export interface IMechanic {
  name: string;
  garageId: Types.ObjectId;
  userId: Types.ObjectId;
  skills: string[];
  imageUrl: string;
  mobileNumber: string;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface GetMechanicResponse{
  mechanics:populatedMechanic[]
  totalMechanics: number;
  totalPages: number;
}

export interface IMechanicMappedData {
  userId: string;
  mechanicId: string;
  name: string;
  email: string;
  isBlocked: boolean;
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

export interface AssignableMechanic {
  _id: Types.ObjectId;
  name: string;
  userId: Types.ObjectId;
  skills: string[]
}