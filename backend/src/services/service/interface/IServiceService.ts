import { HydratedDocument } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import { GetServiceResponse, IService } from "../../../types/services";

export default interface IServiceService {
  createService(data: Partial<IService>): Promise<{ message: string }>;
  getAllServices(query: GetPaginationQuery): Promise<GetServiceResponse>;
  toggleStatus(serviceId: string, action: string): Promise<{ message: string }>;
  deleteService(serviceId: string): Promise<{message: string}>;
  getServicesByGarageId(garageId:string, categoryId:string): Promise<HydratedDocument<IService>[]>;
}
