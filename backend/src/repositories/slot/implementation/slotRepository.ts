import { injectable } from "inversify";
import { Slot, SlotDocument } from "../../../models/slot";
import { ISlot } from "../../../types/slots";
import { BaseRepository } from "../../IBaseRepository";
import { ISlotRepository } from "../interface/ISlotRepository";


@injectable()
export class SlotRepository extends BaseRepository<ISlot> implements ISlotRepository {
    constructor(){
        super(Slot)
    }

    async create(data: Partial<ISlot>) {
        return await this.model.create(data)
    }

    async getSlotsByGarageIdAndDate(garageId: string, date: Date): Promise<SlotDocument[]> {
        return await this.getAll({garageId, date})
    }
}