import { Types } from "mongoose";
import { AppointmentDocument } from "../models/appointment";
import { ILocation } from "./garage";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IAppointmentVehicleSnapshot {
  vehicleId?: Types.ObjectId;
  licensePlate?: string;
  registrationYear?: number;
  fuelType?: string;
  variant?: string;
  color?: string;

  make: {
    _id: Types.ObjectId;
    name: string;
  };

  model: {
    _id: Types.ObjectId;
    name: string;
  };

  imageUrl?: string;
}

export interface IAppointmentUserData {
  name: string,
  email: string;
  mobileNumber: string,
}

export interface IAppointment {
  userId: Types.ObjectId;
  garageId: Types.ObjectId;

  vehicle: IAppointmentVehicleSnapshot;
  userData: IAppointmentUserData;

  slotIds: Types.ObjectId[];
  appointmentDate: Date;
  startTime: string;
  endTime: string;

  serviceIds: Types.ObjectId[];
  totalDuration: number;

  mechanicId?: Types.ObjectId;
  mechanicAssignedAt?: Date;

  paymentId?: Types.ObjectId;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  amount?: number;

  status: AppointmentStatus;

  cancellationReason?: string;
  customerNote?: string;
  mechanicNote?: string;
}

export interface GetMappedAppointmentResponse {
  appointments: AppointmentDocument[];
  totalAppointments: number;
  totalPages: number;
}

export interface CreateAppointmentRequest {
  userData: {
    name: string;
    email: string;
    mobileNumber: string;
  };

  vehicleData: {
    _id?: string;
    userId: string;
    licensePlate: string;
    make: {
      _id: string;
      name: string;
    };
    model: {
      _id: string;
      name: string;
    };
    registrationYear?: number;
    fuelType?: string;
    variant?: string;
    color?: string;
    imageUrl?: string;
  };
  services: {
    _id: string;
    garageId: string;
    categoryId: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];

  garage: string;

  date: string;

  time: {
    slotId: string;
    startTime: string;
  };

  slotIds: string[];

  totalDuration: number;
}

export interface IAppointment {
  userId: Types.ObjectId;
  garageId: Types.ObjectId;

  vehicle: IAppointmentVehicleSnapshot;
  userData: IAppointmentUserData;

  slotIds: Types.ObjectId[];
  appointmentDate: Date;
  startTime: string;
  endTime: string;

  serviceIds: Types.ObjectId[];
  totalDuration: number;

  mechanicId?: Types.ObjectId;
  mechanicAssignedAt?: Date;

  paymentId?: Types.ObjectId;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  amount?: number;

  status: AppointmentStatus;

  cancellationReason?: string;
  customerNote?: string;
  mechanicNote?: string;
}

export interface PopulatedGarage {
  _id: string;
  name: string;
  address: string;
  mobileNumber: string;
  location: ILocation;
}

export interface PopulatedService {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface PopulatedAppointmentData extends Omit<AppointmentDocument, "garageId" | "services">{
  garage: PopulatedGarage;
  services: PopulatedService[];
}