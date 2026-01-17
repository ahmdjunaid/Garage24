import { inject, injectable } from "inversify";
import { SlotDocument } from "../../../models/slot";
import { ISlotService } from "../interface/ISlotService";
import { TYPES } from "../../../DI/types";
import { ISlotRepository } from "../../../repositories/slot/interface/ISlotRepository";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IMechanicRepository } from "../../../repositories/mechanic/interface/IMechanicRepository";
import { createSlotsForDay } from "../../../utils/slotCreateForTheDay";
import { IGarageRepository } from "../../../repositories/garage/interface/IGarageRepository";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class SlotService implements ISlotService {
  constructor(
    @inject(TYPES.SlotRepository) private _slotRepository: ISlotRepository,
    @inject(TYPES.GarageRepository)
    private _garageRepository: IGarageRepository,
    @inject(TYPES.MechanicRepository)
    private _mechanicRepository: IMechanicRepository
  ) {}

  async getSlotsByGarageIdAndDate(
    garageId: string,
    date: Date
  ): Promise<SlotDocument[]> {
    const existingSlots = await this._slotRepository.getSlotsByGarageIdAndDate(
      garageId,
      date
    );

    if (existingSlots.length > 0) {
      return existingSlots;
    }

    const garage = await this._garageRepository.findOne({ userId: garageId });
    if (!garage) {
      throw new AppError(HttpStatus.NOT_FOUND, "Garage not found.")
    }

    const numberOfMechanics =
      await this._mechanicRepository.countDocuments(garageId);

    const capacity = Math.min(numberOfMechanics, garage.numOfServiceBays);
    if (capacity < 1) {
      throw new AppError(HttpStatus.NOT_FOUND, "Garage doesnt have capcity to issue slots.")
    }

    const slotsToCreate = createSlotsForDay({
      garageId,
      date,
      openingTime: garage.startTime,
      closingTime: garage.endTime,
      slotDuration: 30,
      capacity,
    });

    return await this._slotRepository.createSlots(slotsToCreate);
  }
}
