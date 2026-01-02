import IServiceService from "../interface/IServiceService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { GetServiceResponse, IService } from "../../../types/services";
import { IServiceRepository } from "../../../repositories/service/interface/IServiceRepository";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  SERVICE_ALREADY_EXIST,
  SERVICE_CREATED_SUCCESS,
  SERVICE_DOESNT_EXIST,
} from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(TYPES.ServiceRepository)
    private _serviceRepository: IServiceRepository
  ) {}

  async createService(data: Partial<IService>) {
    const serviceExist = await this._serviceRepository.findByName(data.name!);

    if (serviceExist) {
      throw { status: HttpStatus.CONFLICT, message: SERVICE_ALREADY_EXIST };
    }

    await this._serviceRepository.create(data);

    return { message: SERVICE_CREATED_SUCCESS };
  }

  async getAllServices(query: GetPaginationQuery): Promise<GetServiceResponse> {
    return await this._serviceRepository.getAllServices(query);
  }

  async toggleStatus(
    serviceId: string,
    action: string
  ): Promise<{ message: string }> {
    const exist = await this._serviceRepository.getServiceById(serviceId);
    if (!exist) {
      throw { status: HttpStatus.NOT_FOUND, message: SERVICE_DOESNT_EXIST };
    }

    const isBlocked = action === "blocked";

    await this._serviceRepository.findOneAndUpdate(serviceId, { isBlocked });

    return { message: `${action}ed successful` };
  }

  async deleteService(serviceId: string): Promise<{ message: string }> {
    const exist = await this._serviceRepository.getServiceById(serviceId);
    if (!exist) {
      throw { status: HttpStatus.NOT_FOUND, message: SERVICE_DOESNT_EXIST };
    }

    await this._serviceRepository.findOneAndUpdate(serviceId, {isDeleted:true})

    return {message: "Service deleted successful"}
  }
}
