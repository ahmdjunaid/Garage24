import { BaseRepository } from "../../IBaseRepository";
import { IVehicleRepository } from "../interface/IVehicleRepository";
import { IPopulatedVehicle, IVehicle } from "../../../types/vehicle";
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
  ): Promise<IPopulatedVehicle[]> {
    const vehicles = await this.model
      .find({ userId, isDeleted: false })
      .populate([
        { path: "make", select: "name" },
        { path: "model", select: "name" },
      ])
      .lean()

    return vehicles as unknown as IPopulatedVehicle[]
  }

  async getVehicleById(vid: string): Promise<IPopulatedVehicle | null> {
    const vehicle = await this.model.findById(vid)
      .populate([{path:"make", select:"name"},{path:"model", select:"name"}])

    return vehicle as unknown as IPopulatedVehicle;
  }

  async deleteVehicleById(vid: string): Promise<VehicleDocument | null> {
    return await this.deleteById(vid)
  }

  async updateVehicleData(vid: string, data: Partial<IVehicle>): Promise<VehicleDocument|null> {
    return await this.updateById(vid, data)
  }
}
