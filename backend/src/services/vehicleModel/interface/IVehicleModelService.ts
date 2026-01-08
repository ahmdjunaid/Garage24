import { VechicleModelDocument } from "../../../models/vehicleModel";

export interface IVehicleModelService {
    getAllVehicleModels(): Promise<VechicleModelDocument[] | null>
}