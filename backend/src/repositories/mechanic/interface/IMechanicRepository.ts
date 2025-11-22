import { FilterQuery, HydratedDocument } from "mongoose";
import { GetMechanicResponse, IMechanic } from "../../../types/mechanic";
import { GetPaginationQuery } from "../../../types/common";

export interface IMechanicRepository {
  register(mechanicData: {
    garageId: string;
    userId: string;
    name: string;
  }): Promise<{
    message: string;
  }>;

  findOneAndUpdate(
    userId: string,
    data: Partial<IMechanic>
  ): Promise< HydratedDocument<IMechanic> | null>;

  getAllMechanics({ id ,page, limit, searchQuery }:GetPaginationQuery):Promise<GetMechanicResponse>;
  findOneAndDelete(filter:FilterQuery<IMechanic>):Promise<IMechanic | null>;
  findById(id: string): Promise<IMechanic | null>;
}
