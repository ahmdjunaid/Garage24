import { VechicleModelDocument } from "../../../models/vehicleModel";

export interface IVehicleModelRepository {
    getAllVehicleModels(): Promise<VechicleModelDocument[] | null>
}