import { inject, injectable } from "inversify";
import { ILocationController } from "../interface/ILocationController";
import { TYPES } from "../../../DI/types";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  POINTS_MISSING,
} from "../../../constants/messages";
import { ILocationService } from "../../../services/location/interface/ILocationService";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class LocationController implements ILocationController {
  constructor(
    @inject(TYPES.LocationService) private _locationService: ILocationService
  ) {}

  getAddressFromCoordinates = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lat = req.query.lat as string;
      const lng = req.query.lng as string;

      if (!lat || !lng) {
        throw new AppError(HttpStatus.BAD_REQUEST, POINTS_MISSING);
      }
      const response = await this._locationService.getAddressFromCoordinates(
        lat,
        lng
      );
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getCoordinatesFromName = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const name = req.query.name as string;

      if (!name) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._locationService.getCoordinatesFromName(name);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
