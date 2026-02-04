import { IPopulatedVehicle, IVehicle } from "../../../types/vehicle";
import { VehicleDocument } from "../../../models/vehicle";

export interface IVehicleRepository {
  create(data: Partial<IVehicle>): Promise<VehicleDocument>;
  getAllVehicleByUserId(userId:string):Promise<IPopulatedVehicle[]>;
  getVehicleById(vid:string):Promise<IPopulatedVehicle | null>;
  deleteVehicleById(vid:string):Promise<VehicleDocument|null>;
  updateVehicleData(vid:string, data: Partial<IVehicle>): Promise<VehicleDocument|null>;
}
