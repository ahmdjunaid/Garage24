import { GetMappedGarageResponse } from "../../../types/garage";
import { GetPaginationQuery } from "../../../types/common";
import { GetUserResponse, IUser } from "../../../types/user";
import { UserDocument } from "../../../models/user";

export interface IAdminRepository {
  getAllGarages({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetMappedGarageResponse>;
  getAllUsers({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetUserResponse>;
  findByIdAndUpdate( userId: string, data: Partial<IUser>): Promise< UserDocument | null >;
}
