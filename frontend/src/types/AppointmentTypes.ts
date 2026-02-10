import type { timeSlot } from "@/features/appointments/components/AppointmentForm";
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

export type AppointmentServiceStatus =
  | "pending"
  | "started"
  | "completed"
  | "skipped";

export interface IAppointmentServiceData {
  serviceId: string;
  name: string;
  price: number;
  durationMinutes: number;
  status: AppointmentServiceStatus;

  startedAt?: Date;
  completedAt?: Date;
}

export interface IAppointmentEvents {
  message: string;
  doneBy: string;
  actorName: string;
  actorRole: string;
  createdAt: string;
}

export interface IAppointment {
  _id: string;
  appId: string;
  userId: string;
  garageId: string;
  garageUID: string;

  vehicle: IAppointmentVehicleSnapshot;

  userData?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
  };

  slotIds: string[];

  appointmentDate: string;
  startTime: string;
  endTime: string;
  totalDuration: number;

  services: IAppointmentServiceData[];

  mechanicId?: string;
  mechanicAssignedAt?: Date;

  amount?: number;
  paymentId?: string;
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  stripePaymentIntentId: string;

  status: AppointmentStatus;
  events: IAppointmentEvents[];

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
  garageUID?: string;

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

export interface PopulatedMechanic {
  _id: string;
  name: string;
  mobileNumber: string;
  skills: string[];
}

export interface PopulatedAppointmentData
  extends Omit<IAppointment, "garageId" | "mechanicId"> {
  _id: string;
  garageId: PopulatedGarage;
  mechanicId: PopulatedMechanic;
  createdAt: string;
  updatedAt: string;
}

export interface ReschedulePayload {
  date: string;
  releasableSlotIds?: string[]
  slotIds: string[];
  startTime?: string;
  duration?: number;
}
