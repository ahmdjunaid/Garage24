import { BaseRepository } from "../../IBaseRepository";
import { IVehicleRepository } from "../interface/IVehicleRepository";
import { IVehicle, IVehiclePopulated } from "../../../types/vehicle";
import { Vehicle, VehicleDocument } from "../../../models/vehicle";
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

  async getAllVehicleByUserId(
    userId: string
  ): Promise<IVehiclePopulated[]> {
    const vehicles = await this.model
      .find({ userId, isDeleted: false })
      .populate([
        { path: "make", select: "name -_id" },
        { path: "model", select: "name -_id" },
      ])
      .lean()

    return vehicles as unknown as IVehiclePopulated[]
  }

  async getVehicleById(vid: string): Promise<VehicleDocument | null> {
    return await this.getById(vid)
  }
}
