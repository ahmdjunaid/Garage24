import IServiceService from "../interface/IServiceService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import {
  GetServiceResponse,
  IService,
  IServiceDTO,
  IServicePopulated,
} from "../../../types/services";
import { IServiceRepository } from "../../../repositories/service/interface/IServiceRepository";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  SERVICE_ALREADY_EXIST,
  SERVICE_CREATED_SUCCESS,
  SERVICE_DOESNT_EXIST,
} from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";
import { HydratedDocument } from "mongoose";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepository: IServiceRepository
  ) {}

  async createService(data: Partial<IService>) {
    const garageId = data.garageId?.toString()
    const serviceExist = await this._serviceRepository.findByName(data.name!, garageId!);

    if (serviceExist) {
      throw new AppError(HttpStatus.CONFLICT, SERVICE_ALREADY_EXIST)
    }

    await this._serviceRepository.create(data);

    return { message: SERVICE_CREATED_SUCCESS };
  }

  async getAllServices(query: GetPaginationQuery): Promise<GetServiceResponse> {
    const rawServices = await this._serviceRepository.getAllServices(query);

    const services: IServiceDTO[] = rawServices.services.map(
      (s: IServicePopulated) => {
        return {
          _id: s._id,
          name: s.name,
          categoryName: s.categoryId.name,
          price: s.price,
          durationMinutes: s.durationMinutes,
          garageId: s.garageId,
          isDeleted: s.isDeleted,
          isBlocked: s.isBlocked,
        };
      }
    );

    return {
      services: services,
      totalPages: rawServices.totalPages,
      totalServices: rawServices.totalServices
    };
  }

  async toggleStatus(
    serviceId: string,
    action: string
  ): Promise<{ message: string }> {
    const exist = await this._serviceRepository.getServiceById(serviceId);
    if (!exist) {
      throw new AppError(HttpStatus.NOT_FOUND, SERVICE_DOESNT_EXIST)
    }

    const isBlocked = action === "blocked";

    await this._serviceRepository.findOneAndUpdate(serviceId, { isBlocked });

    return { message: `${action}ed successful` };
  }

  async deleteService(serviceId: string): Promise<{ message: string }> {
    const exist = await this._serviceRepository.getServiceById(serviceId);
    if (!exist) {
      throw new AppError(HttpStatus.NOT_FOUND, SERVICE_DOESNT_EXIST)
    }

    await this._serviceRepository.findOneAndUpdate(serviceId, {
      isDeleted: true,
    });

    return { message: "Service deleted successful" };
  }

  async getServicesByGarageId(garageId: string, categoryId:string): Promise<HydratedDocument<IService>[]> {
    return await this._serviceRepository.getServicesByGarageId(garageId, categoryId)
  }
}
