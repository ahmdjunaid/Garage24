import { inject, injectable } from "inversify";
import { IVehicleModelController } from "../interface/IVehicleModelController";
import { TYPES } from "../../../DI/types";
import { IVehicleModelService } from "../../../services/vehicleModel/interface/IVehicleModelService";
import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ERROR_WHILE_FETCH_DATA } from "../../../constants/messages";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class VehicleModelController implements IVehicleModelController {
  constructor(
    @inject(TYPES.VehicleModelService)
    private _vehicleModelService: IVehicleModelService
  ) {}

  getAllVehicleModelsByBrand = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const brandId = req.params.brandId;

      if (!brandId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ERROR_WHILE_FETCH_DATA);
      }

      const vehicleModels =
        await this._vehicleModelService.getAllVehicleModelsByBrand(brandId);

      res.status(HttpStatus.OK).json(vehicleModels);
    } catch (error) {
      next(error);
    }
  };
}
