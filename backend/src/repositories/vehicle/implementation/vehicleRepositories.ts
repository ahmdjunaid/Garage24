import { BaseRepository } from "../../IBaseRepository";
import { IVehicleRepository } from "../interface/IVehicleRepository";
import { IVehicle } from "../../../types/vehicle";
import { Vehicle } from "../../../models/vehicle";
import { injectable } from "inversify";

@injectable()
export class VehicleRepository
  extends BaseRepository<IVehicle>
  implements IVehicleRepository
{
  constructor() {
    super(Vehicle);
  }
  async create(data: Partial<IVehicle>) {
    return await this.model.create(data);
  }
}
