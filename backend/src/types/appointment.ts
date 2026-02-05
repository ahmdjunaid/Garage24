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

export type AppointmentServiceStatus =
  | "pending"
  | "started"
  | "completed"
  | "skipped";

export interface IAppointmentServiceData {
  serviceId: Types.ObjectId;
  name: string;
  price: number;
  durationMinutes: number;
  status: AppointmentServiceStatus;

  startedAt?: Date;
  completedAt?: Date;
}

export interface IAppointmentEvents {
  message: string;
  doneBy: Types.ObjectId;
  actorName: string;
  actorRole: string;
  createdAt?: Date;
}

export interface IAppointment {
  appId: string;
  userId: Types.ObjectId;
  garageId: Types.ObjectId;
  garageUID: Types.ObjectId;

  vehicle: IAppointmentVehicleSnapshot;

  userData: IAppointmentUserData;

  slotIds: Types.ObjectId[];

  appointmentDate: Date;
  startTime: string;
  endTime: string;
  totalDuration: number;

  services: IAppointmentServiceData[];

  mechanicId?: Types.ObjectId;
  mechanicAssignedAt?: Date;

  amount?: number;
  paymentId?: Types.ObjectId;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  stripePaymentIntentId: string;

  status: AppointmentStatus;
  events: IAppointmentEvents[];

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
  garageUID: string;

  date: string;

  time: {
    slotId: string;
    startTime: string;
  };

  slotIds: string[];

  totalDuration: number;
}

export interface PopulatedGarage {
  _id: string;
  name: string;
  address: string;
  mobileNumber: string;
  location: ILocation;
}

export interface PopulatedAppointmentData extends Omit<AppointmentDocument, "garageId">{
  garage: PopulatedGarage;
}


export interface GetMappedPopulatedAppointmentResponse {
  appointments: PopulatedAppointmentData[];
  totalAppointments: number;
  totalPages: number;
}

export interface ReschedulePayload {
  date: string;
  releasableSlotIds: string[]
  slotIds: string[];
  startTime: string;
  duration: number;
}