import { BaseRepository } from "../interface/repositories/IBaseRepository";
import { IMechanicRepository } from "../interface/repositories/IMechanicRepository";
import { IMechanic } from "../types/mechanic";
import { Mechanic } from "../models/mechanic";

export class MechanicRepository
  extends BaseRepository<IMechanic>
  implements IMechanicRepository
{
  constructor() {
    super(Mechanic);
  }
  async register (mechanicData: {
    garageId: string;
    userId: string;
  }){

    const mechanic = new Mechanic({
        garageId: mechanicData.garageId,
        userId: mechanicData.userId
    })
    await mechanic.save()
    return { message: "Registered successful." }
  }

  async findOneAndUpdate(userId: string, data: Partial<IMechanic>) {
      return await Mechanic.findOneAndUpdate({userId:userId}, data, {new:true})
  }
}
