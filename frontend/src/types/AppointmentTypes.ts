import type { timeSlot } from "@/components/layouts/user/section/AppointmentForm";
import type { IAddress, ILocation } from "./GarageTypes";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IAppointmentVehicleSnapshot {
  vehicleId?: string;
  licensePlate?: string;
  registrationYear?: number;
  fuelType?: string;
  variant?: string;
  color?: string;

  make: {
    _id: string;
    name: string;
  };

  model: {
    _id: string;
    name: string;
  };

  imageUrl?: string;
}


export interface IAppointment {
  userId: string;
  garageId: string;

  vehicle: IAppointmentVehicleSnapshot;

  slotIds: string[];
  appointmentDate: string;
  startTime: string;
  endTime: string;

  serviceIds: string[];
  totalDuration: number;

  mechanicId?: string;
  mechanicAssignedAt?: Date;

  paymentId?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  amount?: number;

  status: AppointmentStatus;

  cancellationReason?: string;
  customerNote?: string;
  mechanicNote?: string;
}

export interface CreateAppointmentRequest {
  userData: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  };

  vehicleData: {
    _id?: string;
    userId?: string;
    licensePlate?: string;
    make?: {
      _id: string;
      name: string;
    };
    model?: {
      _id: string;
      name: string;
    };
    registrationYear?: string;
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

  garage?: string;

  date: string | null;

  time: timeSlot | null;

  slotIds: string[];

  totalDuration: number;
}


export interface PopulatedGarage {
  _id: string;
  name: string;
  address: IAddress;
  mobileNumber: string;
  location: ILocation;
}

export interface PopulatedService {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface PopulatedAppointmentData extends Omit<IAppointment, "garageId" | "services" | "serviceIds">{
  _id: string;
  garageId: PopulatedGarage;
  serviceIds: PopulatedService[];
  createdAt: string;
  updatedAt: string;
}