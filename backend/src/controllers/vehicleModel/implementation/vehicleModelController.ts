import { inject, injectable } from "inversify";
import { IVehicleModelController } from "../interface/IVehicleModelController";
import { TYPES } from "../../../DI/types";
import { IVehicleModelService } from "../../../services/vehicleModel/interface/IVehicleModelService";
import { Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { SERVER_ERROR } from "../../../constants/messages";

@injectable()
export class VehicleModelController implements IVehicleModelController {
  constructor(
    @inject(TYPES.VehicleModelService)
    private _vehicleModelService: IVehicleModelService
  ) {}

  getAllVehicleModels = async (req: Request, res: Response) => {
    try {
      const vehicleModels =
        await this._vehicleModelService.getAllVehicleModels();

      res.status(HttpStatus.OK).json(vehicleModels);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || SERVER_ERROR });
    }
  };
}
