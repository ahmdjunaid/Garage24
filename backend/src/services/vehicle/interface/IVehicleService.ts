import { IVehicle } from "../../../types/vehicle";

export default interface IVehicleService {
  createVehicle(data: Partial<IVehicle>): Promise<{message: string}>;
}