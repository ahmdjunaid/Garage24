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
import { normalizePlate } from "../../../utils/normalizeLicencePlate";
import { IVehicleDTO, IVehiclePopulated } from "../../../types/vehicle";
import { VehicleDocument } from "../../../models/vehicle";

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
    const makeConverted = new Types.ObjectId(make);
    const modelConverted = new Types.ObjectId(model);

    const imageUrl = await uploadFile(image, "vehicle");
    if (image?.path) deleteLocalFile(image.path);

    const normalizedPlate = normalizePlate(licensePlate)

    const response = await this._vehicleRepository.create({
      userId: userIdConverted,
      licensePlate: normalizedPlate,
      make: makeConverted,
      model: modelConverted,
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

  async getAllVehicleByUserId(userId: string): Promise<IVehicleDTO[]> {
    const rawVehicles = await this._vehicleRepository.getAllVehicleByUserId(userId)

    const vehicles:IVehicleDTO[] = rawVehicles.map((v:IVehiclePopulated)=>{
      return {
        _id: v._id,
        licensePlate: v.licensePlate,
        makeName: v.make.name,
        model: v.model.name,
        fuelType: v.fuelType,
        variant: v.variant,
        color: v.color,
        registrationYear: v.registrationYear,
        imageUrl: v.imageUrl,
        puccValidity: v.puccValidity,
        insuranceValidity: v.insuranceValidity
      }
    })

    return vehicles;
  }

  async getVehicleById(vid: string): Promise<VehicleDocument | null> {
    return await this._vehicleRepository.getVehicleById(vid)
  }
}
