import { IVehicle, IVehiclePopulated } from "../../../types/vehicle";
import { VehicleDocument } from "../../../models/vehicle";

export interface IVehicleRepository {
  create(data: Partial<IVehicle>): Promise<VehicleDocument>;
  getAllVehicleByUserId(userId:string):Promise<IVehiclePopulated[]>;
  getVehicleById(vid:string):Promise<VehicleDocument | null>;
}
