import { Request, Response } from "express";
import { ISlotController } from "../interface/ISlotController";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../../constants/messages";
import HttpStatus from "../../../constants/httpStatusCodes";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { ISlotService } from "../../../services/slot/interface/ISlotService";

@injectable()
export class SlotController implements ISlotController {
  constructor(@inject(TYPES.SlotService) private _slotService: ISlotService) {}

  getSlotsByGarageIdAndDate = async (req: Request, res: Response) => {
    try {
      const garageId = req.query.garageId as string;
      const date = req.query.date as string;

      if (!garageId || !date) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const convertedDate = new Date(date);
      const response = await this._slotService.getSlotsByGarageIdAndDate(
        garageId,
        convertedDate
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || SERVER_ERROR });
    }
  };
}
