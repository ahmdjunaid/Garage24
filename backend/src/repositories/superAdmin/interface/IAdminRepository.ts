import { GetPaginationQuery } from "../../../types/common";
import { GetUserResponse, IUser } from "../../../types/user";
import { UserDocument } from "../../../models/user";
import { IPopulatedGarage } from "../../../types/garage";

export interface IAdminRepository {
  getAllGarages({ page, limit, searchQuery }:GetPaginationQuery):Promise<{ 
    garages:IPopulatedGarage[];
    totalGarages: number;
    totalPages: number;
  }>;
  getAllUsers({ page, limit, searchQuery }:GetPaginationQuery):Promise<GetUserResponse>;
  findByIdAndUpdate( userId: string, data: Partial<IUser>): Promise< UserDocument | null >;
}
