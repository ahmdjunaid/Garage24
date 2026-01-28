import { injectable } from "inversify";
import { Slot, SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";
import { BaseRepository } from "../../IBaseRepository";
import { ISlotRepository } from "../interface/ISlotRepository";
import { getUTCDayRange } from "../../../utils/dateToIST";
import { ClientSession, Types } from "mongoose";

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
    const { start, end } = getUTCDayRange(date);

    return await this.model.find({
      garageId,
      date: {
        $gte: start,
        $lte: end,
      },
    });
  }

  async findSlotById(id: string): Promise<SlotDocument | null> {
    return await this.model.findById(id);
  }

  async incrementBookedCount(slotIds: string[], session?: ClientSession) {
    const query = this.model.updateMany(
      { _id: { $in: slotIds } },
      { $inc: { bookedCount: 1 } }
    );

    if (session) {
      query.session(session);
    }

    await query.exec();
  }

    async decrementBookedCount(slotIds: string[], session?: ClientSession) {
    const query = this.model.updateMany(
      { _id: { $in: slotIds } },
      { $inc: { bookedCount: -1 } }
    );

    if (session) {
      query.session(session);
    }

    await query.exec();
  }

  async findSlotsByIds(
    slotIds: string[],
    session?: ClientSession
  ): Promise<SlotDocument[]> {
    return this.model.find(
      {
        _id: { $in: slotIds.map(id => new Types.ObjectId(id)) },
      },
      {
        capacity: 1,
        bookedCount: 1,
      },
      { session }
    );
  }
}
