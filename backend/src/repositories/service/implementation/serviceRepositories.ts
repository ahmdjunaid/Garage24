import { BaseRepository } from "../../IBaseRepository";
import { IServiceRepository } from "../interface/IServiceRepository";
import { IService } from "../../../types/services";
import { Service } from "../../../models/service";
import { HydratedDocument } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";

export class ServiceRepository
  extends BaseRepository<IService>
  implements IServiceRepository
{
  constructor() {
    super(Service);
  }
  async create(serviceData: Partial<IService>) {
    return await this.model.create(serviceData);
  }

  async findByName(name: string): Promise<HydratedDocument<IService> | null> {
    return await this.getByFilter({
      name: { $regex: new RegExp(name, "i") },
    });
  }

  async getAllServices({ id, page, limit, searchQuery }: GetPaginationQuery) {
    const skip = (page - 1) * limit;
    const searchFilter = {
      garageId: id,
      ...(searchQuery && { name: { $regex: searchQuery, $options: "i" } }),
      isDeleted: false,
      isBlocked: false,
    };

    const services = await this.model
      .find(searchFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalServices = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalServices / limit);

    return { services, totalServices, totalPages };
  }

  async findOneAndUpdate(
    serviceId: string,
    data: Partial<IService>
  ): Promise<HydratedDocument<IService> | null> {
    return await this.model.findByIdAndUpdate(serviceId, { $set: data });
  }

  async getServiceById(serviceId: string): Promise<HydratedDocument<IService> | null> {
    return await this.model.findById(serviceId)
  }
}
