import { Types } from "mongoose";

export interface IService {
  garageId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface IServicePopulated {
  _id: Types.ObjectId;
  garageId: Types.ObjectId;
  categoryId: {
    name: string;
  };
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface IServiceDTO {
  _id: Types.ObjectId;
  garageId: Types.ObjectId;
  categoryName:string;
  name: string;
  price: number;
  durationMinutes: number;
  isDeleted: boolean;
  isBlocked: boolean;
}

export interface GetServiceResponse{
  services:IServiceDTO[]
  totalServices: number;
  totalPages: number;
}