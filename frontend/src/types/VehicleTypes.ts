export interface IVehicle {
  _id?: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  registrationYear: number;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  variant?: string;
  color: string;
  imageUrl?: string;
  insuranceValidity: string;
  puccValidity: string;
  createdAt?: string;
  updatedAt?: string;
}