import { SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";

export interface ISlotService {
    createSlot(data: Partial<ISlot>): Promise<SlotDocument>;
    getSlotsByGarageIdAndDate(garageId:string, date:Date): Promise<SlotDocument[]>;
}