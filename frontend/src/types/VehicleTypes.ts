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
  lastServicedKM?:string;
  puccValidity: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IVehicleDTO {
  _id: string;
  licensePlate: string;
  makeName: string;
  model: string;
  registrationYear: number | string;
  fuelType: string;
  variant?: string;
  color?: string;
  imageUrl?: string;
  insuranceValidity: Date;
  puccValidity: Date;
  lastServicedKM?:string;
}