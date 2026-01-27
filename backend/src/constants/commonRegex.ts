import { normalizePlate } from "../utils/normalizeLicencePlate";

export const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export function isValidIndianPlate(plate: string): boolean {
  const normalized = normalizePlate(plate);

  const patterns = [
    /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{3,4}$/,
    /^[A-Z]{3}\d{3,4}$/,
    /^[A-Z]{1,2}\d{3,4}$/,
    /^BH\d{2}[A-Z]{2}\d{4}$/
  ];

  return patterns.some((regex) => regex.test(normalized));
}