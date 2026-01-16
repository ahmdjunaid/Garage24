import { Types } from "mongoose";
import { AppointmentDocument } from "../models/appointment";

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


export interface IAppointment {
  userId: Types.ObjectId;
  garageId: Types.ObjectId;

  vehicle: IAppointmentVehicleSnapshot;

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

export interface CreateAppointmentDTO {
  userId: string;

  mobileNumber: string;

  garageId: string;

  vehicleData: {
    _id?: string;
    licensePlate?: string;
    registrationYear?: number | string;
    fuelType?: string;
    variant?: string;
    color?: string;
    imageUrl?: string;

    make: {
      _id: string;
      name: string;
    };

    model: {
      _id: string;
      name: string;
    };
  };

  slotIds: string[];
  appointmentDate: string;
  startTime: string;
  endTime?: string;

  services: {
    _id: string;
    durationMinutes: number;
    price: number;
  }[];
  

  customerNote?: string;
}


export interface GetMappedAppointmentResponse {
  appointments: AppointmentDocument[];
  totalAppointments: number;
  totalPages: number;
}