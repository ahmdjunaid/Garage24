import type { IAddress } from "./GarageTypes";

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

export interface BarChartProps {
  values: number[];
  labels?: string[];
  highlight?: number;
}

export interface LineChartProps {
  values: number[];
  labels: string[];
}

export interface MostBookedGarage {
  garageId: string;
  count: number;
  name: string;
  location: IAddress;
  imageUrl: string;
  supportedFuelTypes: string[];
  isBlocked: boolean;
  isDeleted: boolean;
}
