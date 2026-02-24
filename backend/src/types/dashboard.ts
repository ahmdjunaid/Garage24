import { Types } from "mongoose";
import { IAddress, ILocation } from "./garage";

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
