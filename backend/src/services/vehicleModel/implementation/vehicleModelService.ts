import { inject, injectable } from "inversify";
import { IVehicleModelService } from "../interface/IVehicleModelService";
import { TYPES } from "../../../DI/types";
import { IVehicleModelRepository } from "../../../repositories/vehicleModel/interface/IVehicleModelRepository";
import { VechicleModelDocument } from "../../../models/vehicleModel";

@injectable()
export class VehicleModelService implements IVehicleModelService {
    constructor(
        @inject(TYPES.VehicleModelRepository) private _vehicleModelRepository: IVehicleModelRepository,
    ){}

    async getAllVehicleModels(): Promise<VechicleModelDocument[] | null> {
        return await this._vehicleModelRepository.getAllVehicleModels()
    }
}