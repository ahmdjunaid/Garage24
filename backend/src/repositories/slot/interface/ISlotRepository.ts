import { SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";

export interface ISlotRepository {
    createSlots(data: ISlot[]): Promise<SlotDocument[]>;
    getSlotsByGarageIdAndDate(garageId:string, date:Date):Promise<SlotDocument[]>
}