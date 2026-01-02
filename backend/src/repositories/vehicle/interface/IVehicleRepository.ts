import { IVehicle } from "../../../types/vehicle";
import { VehicleDocument } from "../../../models/vehicle";

export interface IVehicleRepository {
  create(data: Partial<IVehicle>): Promise<VehicleDocument>;
}
