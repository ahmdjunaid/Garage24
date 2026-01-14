import { HydratedDocument } from "mongoose";
import {
  IService,
  IServicePopulated,
} from "../../../types/services";
import { GetPaginationQuery } from "../../../types/common";

export interface IServiceRepository {
  create(serviceData: Partial<IService>): Promise<HydratedDocument<IService>>;

  findByName(name: string): Promise<HydratedDocument<IService> | null>;

  getAllServices({
    id,
    page,
    limit,
    searchQuery,
  }: GetPaginationQuery): Promise<{
    services: IServicePopulated[];
    totalServices: number;
    totalPages: number;
  }>;

  findOneAndUpdate(
    serviceId: string,
    data: Partial<IService>
  ): Promise<HydratedDocument<IService> | null>;

  getServiceById(serviceId: string): Promise<HydratedDocument<IService> | null>;
}
