import { VechicleModelDocument } from "../../../models/vehicleModel";

export interface IVehicleModelService {
    getAllVehicleModelsByBrand(brandId:string): Promise<VechicleModelDocument[] | null>
}