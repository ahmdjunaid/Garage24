import { ClientSession } from "mongoose";
import { SlotDocument } from "../../../models/slot";

export interface ISlotService {
  getSlotsByGarageIdAndDate(
    garageId: string,
    date: Date
  ): Promise<SlotDocument[]>;
  lockSlots(slotIds: string[]): Promise<void>;
  releaseSlots(slotIds: string[]): Promise<void>;
  incrementBookedCount(
    slotIds: string[],
    session?: ClientSession
  ): Promise<void>;
  validateSlotCapacity(slotIds: string[], session: ClientSession):Promise<void>
}
