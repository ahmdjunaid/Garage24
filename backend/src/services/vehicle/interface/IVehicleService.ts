import { VehicleDocument } from "../../../models/vehicle";
import { IVehicleDTO } from "../../../types/vehicle";

export default interface IVehicleService {
  createVehicle(
    userId: string,
    licensePlate: string,
    make: string,
    model: string,
    registrationYear: number,
    fuelType: string,
    color: string,
    insuranceValidity: Date,
    puccValidity: Date,
    image: Express.Multer.File,
    variant?: string
  ): Promise<{ message: string }>;

  getAllVehicleByUserId(userId:string):Promise<IVehicleDTO[]>;
  getVehicleById(vid:string):Promise<VehicleDocument | null>
}
