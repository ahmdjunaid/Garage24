import { BaseRepository } from "../../IBaseRepository";
import { IServiceRepository } from "../interface/IServiceRepository";
import { IService, IServicePopulated } from "../../../types/services";
import { Service } from "../../../models/service";
import { HydratedDocument } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import { injectable } from "inversify";

@injectable()
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

  async findByName(name: string, garageId:string): Promise<HydratedDocument<IService> | null> {
    return await this.getByFilter({
      garageId,
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
      .sort({ createdAt: -1 })
      .populate({ path: "categoryId", select: "name -_id" })
      .lean();

    const totalServices = await this.model.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalServices / limit);

    return {
      services: services as unknown as IServicePopulated[],
      totalServices,
      totalPages,
    };
  }

  async findOneAndUpdate(
    serviceId: string,
    data: Partial<IService>
  ): Promise<HydratedDocument<IService> | null> {
    return await this.model.findByIdAndUpdate(serviceId, { $set: data });
  }

  async getServiceById(
    serviceId: string
  ): Promise<HydratedDocument<IService> | null> {
    return await this.model.findById(serviceId);
  }

  async getServicesByGarageId(
    garageId: string,
    categoryId: string
  ): Promise<HydratedDocument<IService>[]> {
    return await this.getAll({
      garageId,
      categoryId,
      isDeleted: false,
      isBlocked: false,
    });
  }
}
