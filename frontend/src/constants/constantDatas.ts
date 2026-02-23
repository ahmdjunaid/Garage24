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
  { label: "Last Week", value: "week" },
  { label: "Last Month", value: "month" },
  { label: "Current Year", value: "year" },
];