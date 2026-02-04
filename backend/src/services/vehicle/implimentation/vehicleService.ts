import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ERROR_WHILE_CREATING_VEHICLE,
  VEHICLE_CREATED_SUCCESS,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IVehicleService, {
  VehicleCreateData,
} from "../interface/IVehicleService";
import { IVehicleRepository } from "../../../repositories/vehicle/interface/IVehicleRepository";
import { Types } from "mongoose";
import { deleteFromS3, uploadFile } from "../../../config/s3Service";
import { deleteLocalFile } from "../../../helper/helper";
import { normalizePlate } from "../../../utils/normalizeLicencePlate";
import {
  IPopulatedVehicle,
  IVehicle,
  IVehicleDTO,
} from "../../../types/vehicle";
import { AppError } from "../../../middleware/errorHandler";
import { VehicleDocument } from "../../../models/vehicle";
import { extractS3KeyFromUrl } from "../../../utils/extractS3KeyFromUrl";

@injectable()
export class VehicleService implements IVehicleService {
  constructor(
    @inject(TYPES.VehicleRepository)
    private _vehicleRepository: IVehicleRepository
  ) {}

  async createVehicle(data: VehicleCreateData): Promise<{ message: string }> {
    const userIdConverted = new Types.ObjectId(data.userId);
    const makeConverted = new Types.ObjectId(data.make);
    const modelConverted = new Types.ObjectId(data.model);

    const imageUrl = await uploadFile(data.image, "vehicle");
    if (data.image?.path) deleteLocalFile(data.image.path);

    const normalizedPlate = normalizePlate(data.licensePlate);

    const response = await this._vehicleRepository.create({
      userId: userIdConverted,
      licensePlate: normalizedPlate,
      make: makeConverted,
      model: modelConverted,
      registrationYear: data.registrationYear,
      fuelType: data.fuelType,
      variant: data.variant,
      color: data.color,
      insuranceValidity: data.insuranceValidity,
      puccValidity: data.puccValidity,
      imageUrl,
    });

    if (!response) {
      throw new AppError(HttpStatus.BAD_REQUEST, ERROR_WHILE_CREATING_VEHICLE);
    }

    return { message: VEHICLE_CREATED_SUCCESS };
  }

  async getAllVehicleByUserId(userId: string): Promise<IVehicleDTO[]> {
    const rawVehicles =
      await this._vehicleRepository.getAllVehicleByUserId(userId);

    const vehicles: IVehicleDTO[] = rawVehicles.map((v: IPopulatedVehicle) => {
      return {
        _id: v._id,
        licensePlate: v.licensePlate,
        makeName: v.make.name,
        makeId: v.make._id,
        model: v.model.name,
        modelId: v.model._id,
        fuelType: v.fuelType,
        variant: v.variant,
        color: v.color,
        registrationYear: v.registrationYear,
        imageUrl: v.imageUrl,
        puccValidity: v.puccValidity,
        insuranceValidity: v.insuranceValidity,
      };
    });

    return vehicles;
  }

  async getVehicleById(vid: string): Promise<IPopulatedVehicle | null> {
    return await this._vehicleRepository.getVehicleById(vid);
  }

  async deleteVehicleById(vid: string): Promise<VehicleDocument | null> {
    return await this._vehicleRepository.deleteVehicleById(vid);
  }

  async updateVehicleData(
    vid: string,
    data: Partial<VehicleCreateData>
  ): Promise<VehicleDocument | null> {
    const vehicle = await this._vehicleRepository.getVehicleById(vid);
    if (!vehicle) {
      throw new AppError(HttpStatus.BAD_REQUEST, "Vehicle not found.");
    }

    const updatePayload: Partial<IVehicle> = {};

    if (data.color !== undefined) {
      updatePayload.color = data.color;
    }

    if (data.insuranceValidity !== undefined) {
      updatePayload.insuranceValidity = data.insuranceValidity;
    }

    if (data.puccValidity !== undefined) {
      updatePayload.puccValidity = data.puccValidity;
    }

    if (data.image) {
      const imageUrl = await uploadFile(data.image, "vehicle");
      await deleteLocalFile(data.image.path);

      if (vehicle.imageUrl) {
        await deleteFromS3(extractS3KeyFromUrl(vehicle.imageUrl));
      }

      updatePayload.imageUrl = imageUrl;
    }

    return await this._vehicleRepository.updateVehicleData(vid, updatePayload);
  }
}
