import { injectable } from "inversify";
import {
  IVehicleModel,
  VechicleModelDocument,
  VehicleModel,
} from "../../../models/vehicleModel";
import { IVehicleModelRepository } from "../interface/IVehicleModelRepository";
import { BaseRepository } from "../../IBaseRepository";

@injectable()
export class VehicleModelRepository
  extends BaseRepository<IVehicleModel>
  implements IVehicleModelRepository
{
  constructor() {
    super(VehicleModel);
  }

  async getAllVehicleModelsByBrand(
    brandId: string
  ): Promise<VechicleModelDocument[] | null> {
    return await this.getAll({ brandId, isDeleted: false, isBlocked: false });
  }
}
