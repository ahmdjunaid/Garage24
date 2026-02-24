import type { fuelTypeType } from "@/types/VehicleTypes";

export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const fuelTypes:fuelTypeType[] = ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"]

export const dashboardPeriods = [
  { label: "Current Week", value: "week" },
  { label: "Current Month", value: "month" },
  { label: "Current Year", value: "year" },
];