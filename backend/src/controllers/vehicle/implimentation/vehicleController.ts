import { Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IVehicleController from "../interface/IVehicleController";
import IVehicleService from "../../../services/vehicle/interface/IVehicleService";

@injectable()
export class VehicleController implements IVehicleController {
  constructor(
    @inject(TYPES.VehicleService) private _vehicleService: IVehicleService
  ) {}

  createVehicle = async (req: Request, res: Response) => {
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
      const userId = req.user?.id

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
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
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

      res.status(HttpStatus.OK).json({ message });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || SERVER_ERROR });
    }
  };
}
