import { Types } from "mongoose";

export interface IService {
  garageId: Types.ObjectId;
  category: string;
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface GetServiceResponse{
  services:IService[]
  totalServices: number;
  totalPages: number;
}