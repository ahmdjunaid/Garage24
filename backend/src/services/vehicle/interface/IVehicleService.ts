import { VehicleDocument } from "../../../models/vehicle";
import { IPopulatedVehicle, IVehicleDTO } from "../../../types/vehicle";

export interface VehicleCreateData {
    userId?: string;
    licensePlate: string;
    make: string;
    model: string;
    registrationYear: number;
    fuelType: string;
    color: string;
    insuranceValidity: Date;
    puccValidity: Date;
    image: Express.Multer.File;
    variant?: string;
}

export default interface IVehicleService {
  createVehicle(data:VehicleCreateData): Promise<{ message: string }>;
  getAllVehicleByUserId(userId:string):Promise<IVehicleDTO[]>;
  getVehicleById(vid:string):Promise<IPopulatedVehicle | null>
  deleteVehicleById(vid: string): Promise<VehicleDocument | null>;
  updateVehicleData(vid:string, data: Partial<VehicleCreateData>): Promise<VehicleDocument|null>;
}
