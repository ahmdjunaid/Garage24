import { Types } from "mongoose";
import { IAddress } from "./garage";

export interface DashboardData {
    revenue: number;
    revChange: string;
    revUp: boolean;
    subscriptions: number;
    subChange: string;
    subUp: boolean;
    services: number;
    servChange: string;
    servUp: boolean;
    totalSubs: number;
    subGrowth: string;
    bookingChart: number[];
    labels: string[];
    subChart: number[];
    subLabels: string[];
}

export interface DashboardAggregationResult {
  revenue: { total: number }[];
  chart: { _id: number; count: number }[];
  totalCount: { count: number }[];
}

export interface AppointmentAggregateOnStatus {
  totalAppointments: number;
  completedAppointments: number;
}

export interface MostBookedGarage {
  garageId: Types.ObjectId;
  count: number;
  name: string;
  location: IAddress;
  imageUrl: string;
  supportedFuelTypes: string[];
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface MostBookedServices {
  name: string;
  durationMinutes: number;
  count: number;
  isBlocked: boolean;
  isDeleted: boolean;
}


export interface GarageDashboardData {
    revenue: number;
    revChange: string;
    revUp: boolean;

    appointments: number;
    appointmentChange: string;
    appointmentUp: boolean;

    completed: number;
    completedChange: string;
    completedUp: boolean;

    bookingChart: number[];
    labels: string[];
}