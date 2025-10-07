import { Request, Response } from "express";
import IGarageController from "../../interface/controller/garage/IGarageController";
import IGarageService from "../../interface/services/garage/IGarageService";
import HttpStatus from "../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../constants/messages";

export class GarageController implements IGarageController {
  constructor(private _garageService: IGarageService) {}

  onboarding = async (req: Request, res: Response) => {
    try {
      const {
        garageId,
        location,
        plan,
        startTime,
        endTime,
        selectedHolidays,
        image,
        mobile,
        isRSAEnabled,
      } = req.body;

      if (
        !garageId ||
        !location ||
        !plan ||
        !startTime ||
        !endTime ||
        !selectedHolidays ||
        !image ||
        !mobile ||
        !isRSAEnabled
      ) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._garageService.onboarding(
        garageId,
        location,
        plan,
        startTime,
        endTime,
        selectedHolidays,
        image,
        mobile,
        isRSAEnabled
      );
      res.status(HttpStatus.OK).json({ garage: response });
    } catch (error) {
        console.error(error)
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };
}
