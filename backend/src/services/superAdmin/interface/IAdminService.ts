import { GetPaginationQuery } from "../../../types/common";
import { GetMappedUsersResponse } from "../../../types/admin";
import { GetMappedGarageResponse, IGarage } from "../../../types/garage";

export default interface IAdminService {
  getAllUsers(query: GetPaginationQuery):Promise<GetMappedUsersResponse>;
  getAllGarages(query: GetPaginationQuery):Promise<GetMappedGarageResponse>;
  toggleStatus(userId:string,action: string): Promise<{message:string}>;
  garageApproval(userId:string,action: string): Promise<{message:string}>;
  getGarageById(id: string):Promise<IGarage | null>;
}