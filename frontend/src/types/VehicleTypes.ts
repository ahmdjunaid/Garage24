export type fuelTypeType = "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG" | ""

export interface IVehicle {
  _id?: string;
  userId: string;
  licensePlate: string;
  make: string;
  model: string;
  registrationYear: string;
  fuelType: fuelTypeType;
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


export interface IPopulatedVehicle extends Omit<IVehicle, "make" | "model"> {
  make: {
    _id: string;
    name: string;
  },
  model: {
    _id: string;
    name: string;
  }
}