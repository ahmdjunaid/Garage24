import { NextFunction, Request, Response } from "express";
import { ISlotController } from "../interface/ISlotController";
import { ALL_FIELDS_REQUIRED } from "../../../constants/messages";
import HttpStatus from "../../../constants/httpStatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { ISlotService } from "../../../services/slot/interface/ISlotService";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class SlotController implements ISlotController {
  constructor(@inject(TYPES.SlotService) private _slotService: ISlotService) {}

  getSlotsByGarageIdAndDate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const garageId = req.query.garageId as string;
      const date = req.query.date as string;

      if (!garageId || !date) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED)
      }

      const convertedDate = new Date(date);
      const response = await this._slotService.getSlotsByGarageIdAndDate(
        garageId,
        convertedDate
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error)
    }
  };
}
