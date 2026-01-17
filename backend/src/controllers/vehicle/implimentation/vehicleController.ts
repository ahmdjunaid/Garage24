import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  ERROR_WHILE_FETCH_DATA,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IVehicleController from "../interface/IVehicleController";
import IVehicleService from "../../../services/vehicle/interface/IVehicleService";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class VehicleController implements IVehicleController {
  constructor(
    @inject(TYPES.VehicleService) private _vehicleService: IVehicleService
  ) {}

  createVehicle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        licensePlate,
        make,
        model,
        registrationYear,
        fuelType,
        variant,
        color,
        insuranceValidity,
        puccValidity,
      } = req.body;
      const image = req.file as Express.Multer.File;
      const userId = req.user?.id;

      if (
        !userId ||
        !licensePlate ||
        !make ||
        !model ||
        !registrationYear ||
        !registrationYear ||
        !fuelType ||
        !variant ||
        !color ||
        !insuranceValidity ||
        !puccValidity ||
        !image
      ) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED)
      }

      const message = await this._vehicleService.createVehicle(
        userId,
        licensePlate,
        make,
        model,
        registrationYear,
        fuelType,
        color,
        insuranceValidity,
        puccValidity,
        image,
        variant
      );

      res.status(HttpStatus.OK).json(message);
    } catch (error) {
    next(error)
    }
  };

  getAllVehicleByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ERROR_WHILE_FETCH_DATA)
      }

      const vehicles = await this._vehicleService.getAllVehicleByUserId(userId);

      res.status(HttpStatus.OK).json(vehicles);
    } catch (error) {
      next(error)
    }
  };

  getVehicleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vehicleId = req.query.vehicleId as string;
      if (!vehicleId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ERROR_WHILE_FETCH_DATA)
      }

      const vehicle = await this._vehicleService.getVehicleById(vehicleId);
      res.status(HttpStatus.OK).json(vehicle);
    } catch (error) {
      next(error)
    }
  }
}
