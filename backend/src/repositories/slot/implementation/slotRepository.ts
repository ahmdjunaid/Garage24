import { injectable } from "inversify";
import { Slot, SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";
import { BaseRepository } from "../../IBaseRepository";
import { ISlotRepository } from "../interface/ISlotRepository";
import { getUTCDayRange } from "../../../utils/dateToIST";

@injectable()
export class SlotRepository
  extends BaseRepository<ISlot>
  implements ISlotRepository
{
  constructor() {
    super(Slot);
  }

  async createSlots(data: ISlot[]): Promise<SlotDocument[]> {
    return await this.model.insertMany(data);
  }

  async getSlotsByGarageIdAndDate(
    garageId: string,
    date: Date
  ): Promise<SlotDocument[]> {

    const { start,end } = getUTCDayRange(date);

    return await this.model.find({
      garageId,
      date: {
        $gte: start,
        $lte: end,
      },
    });
  }
}
