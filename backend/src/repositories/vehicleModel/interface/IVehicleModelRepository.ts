import { VechicleModelDocument } from "../../../models/vehicleModel";

export interface IVehicleModelRepository {
    getAllVehicleModelsByBrand(brandId:string): Promise<VechicleModelDocument[] | null>
}