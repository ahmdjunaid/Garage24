import { inject, injectable } from "inversify";
import { ILocationController } from "../interface/ILocationController";
import { TYPES } from "../../../DI/types";
import { Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../../constants/messages";
import { ILocationService } from "../../../services/location/interface/ILocationService";

@injectable()
export class LocationController implements ILocationController {
  constructor(
    @inject(TYPES.LocationService) private _locationService: ILocationService
  ) {}

  getAddressFromCoordinates = async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lng = req.query.lng as string;

      if (!lat || !lng) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: "Latitude and Longitude cannot be blank.",
        };
      }
      const response = await this._locationService.getAddressFromCoordinates(
        lat,
        lng
      );
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getCoordinatesFromName = async (req: Request, res: Response) => {
    try {
      const name = req.query.name as string;

      if (!name) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: ALL_FIELDS_REQUIRED,
        };
      }

      const response = await this._locationService.getCoordinatesFromName(name);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };
}
