import { inject, injectable } from "inversify";
import { SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";
import { ISlotService } from "../interface/ISlotService";
import { TYPES } from "../../../DI/types";
import { ISlotRepository } from "../../../repositories/slot/interface/ISlotRepository";

@injectable()
export class SlotService implements ISlotService {
    constructor(
        @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository
    ){}

    async createSlot(data: Partial<ISlot>): Promise<SlotDocument> {
        
    }

    async getSlotsByGarageIdAndDate(garageId: string, date: Date): Promise<SlotDocument[]> {
        // const slots = await this._slotRepository.getSlotsByGarageIdAndDate(garageId, date)
        // if(!slots){
        //     await this._slotRepository.create
        // }
    }
}