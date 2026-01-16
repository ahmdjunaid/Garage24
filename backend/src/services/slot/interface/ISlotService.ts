import { SlotDocument } from "../../../models/slot";

export interface ISlotService {
    getSlotsByGarageIdAndDate(garageId:string, date:Date): Promise<SlotDocument[]>;
}