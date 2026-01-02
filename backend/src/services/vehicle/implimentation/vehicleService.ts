import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_CREATING_VEHICLE,
  VEHICLE_CREATED_SUCCESS,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IVehicleService from "../interface/IVehicleService";
import { IVehicle } from "../../../types/vehicle";
import { IVehicleRepository } from "../../../repositories/vehicle/interface/IVehicleRepository";

@injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @inject(TYPES.VehicleRepository) private _vehicleRepository: IVehicleRepository
  ) {}

  async createVehicle(data: Partial<IVehicle>): Promise<{ message: string }> {
    // const existing = await this._planRepository.getPlanByName(data.licensePlate!);

    // if (existing) {
    //   throw { status: HttpStatus.CONFLICT, message: PLAN_ALREADY_EXIST };
    // }

    const response = await this._vehicleRepository.create(data);

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_CREATING_VEHICLE,
      };
    }

    return { message: VEHICLE_CREATED_SUCCESS };
  }
}
