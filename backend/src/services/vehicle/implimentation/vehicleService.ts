import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_CREATING_VEHICLE,
  VEHICLE_CREATED_SUCCESS,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IVehicleService from "../interface/IVehicleService";
import { IVehicleRepository } from "../../../repositories/vehicle/interface/IVehicleRepository";
import { Types } from "mongoose";
import { uploadFile } from "../../../config/s3Service";
import { deleteLocalFile } from "../../../helper/helper";

@injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @inject(TYPES.VehicleRepository)
    private _vehicleRepository: IVehicleRepository
  ) {}

  async createVehicle(
    userId: string,
    licensePlate: string,
    make: string,
    model: string,
    registrationYear: number,
    fuelType: string,
    color: string,
    insuranceValidity: Date,
    puccValidity: Date,
    image: Express.Multer.File,
    variant?: string
  ): Promise<{ message: string }> {
    const userIdConverted = new Types.ObjectId(userId);
    const imageUrl = await uploadFile(image, "vehicle");
    if (image?.path) deleteLocalFile(image.path);

    const response = await this._vehicleRepository.create({
      userId: userIdConverted,
      licensePlate,
      make,
      model,
      registrationYear,
      fuelType,
      variant,
      color,
      insuranceValidity,
      puccValidity,
      imageUrl
    });

    if (!response) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        message: ERROR_WHILE_CREATING_VEHICLE,
      };
    }

    return { message: VEHICLE_CREATED_SUCCESS };
  }
}
