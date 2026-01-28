import { ClientSession } from "mongoose";
import { SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";

export interface ISlotRepository {
    createSlots(data: ISlot[]): Promise<SlotDocument[]>;
    getSlotsByGarageIdAndDate(garageId:string, date:Date):Promise<SlotDocument[]>;
    findSlotById(id:string):Promise<SlotDocument|null>;
    incrementBookedCount( slotIds: string[], session?: ClientSession):Promise<void>;
    findSlotsByIds( slotIds: string[], session?: ClientSession): Promise<SlotDocument[]>
}