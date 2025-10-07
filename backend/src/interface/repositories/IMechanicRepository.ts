import { HydratedDocument } from "mongoose";
import { IMechanic } from "../../types/mechanic";

export interface IMechanicRepository {
  register(mechanicData: {
    garageId: string;
    userId: string;
  }): Promise<{
    message: string;
  }>;

  findOneAndUpdate(
    userId: string,
    data: Partial<IMechanic>
  ): Promise< HydratedDocument<IMechanic> | null>;
}
