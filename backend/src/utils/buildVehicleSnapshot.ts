// appointment.utils.ts
import { Types } from "mongoose";
import { IAppointmentVehicleSnapshot } from "../types/appointment";
import { VehiclePayload } from "../types/vehicle";
import { normalizePlate } from "./normalizeLicencePlate";

export function buildVehicleSnapshot(
  vehicleData: VehiclePayload
): IAppointmentVehicleSnapshot {

  return {
    vehicleId: vehicleData._id
      ? new Types.ObjectId(vehicleData._id)
      : undefined,

    licensePlate: normalizePlate(vehicleData.licensePlate),

    registrationYear: vehicleData.registrationYear
      ? Number(vehicleData.registrationYear)
      : undefined,

    fuelType: vehicleData.fuelType,
    variant: vehicleData.variant,
    color: vehicleData.color,
    imageUrl: vehicleData.imageUrl,

    make: {
      _id: new Types.ObjectId(vehicleData.make._id),
      name: vehicleData.make.name,
    },

    model: {
      _id: new Types.ObjectId(vehicleData.model._id),
      name: vehicleData.model.name,
    },
  };
}
