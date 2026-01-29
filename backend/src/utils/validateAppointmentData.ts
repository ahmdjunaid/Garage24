import { isValidIndianPlate } from "../constants/commonRegex";
import HttpStatus from "../constants/httpStatusCodes";
import { AppError } from "../middleware/errorHandler";
import { CreateAppointmentRequest } from "../types/appointment";

export const validateCreateAppointment = (body: CreateAppointmentRequest) => {
  const {
    userData,
    vehicleData,
    services,
    garage,
    garageUID,
    date,
    time,
    slotIds,
    totalDuration,
  } = body;

  if (!userData?.name)
    throw new AppError(HttpStatus.BAD_REQUEST, "User name is required");

  if (!userData?.email)
    throw new AppError(HttpStatus.BAD_REQUEST, "User email is required");

  if (!userData?.mobileNumber)
    throw new AppError(HttpStatus.BAD_REQUEST, "Mobile number is required");

  if (!vehicleData.make?._id)
    throw new AppError(HttpStatus.BAD_REQUEST, "Vehicle make is required");

  if (!vehicleData.model?._id)
    throw new AppError(HttpStatus.BAD_REQUEST, "Vehicle model is required");

  if (!isValidIndianPlate(vehicleData.licensePlate))
    throw new AppError(HttpStatus.BAD_REQUEST, "Enter a valid vehicle number.");

  if (!vehicleData.registrationYear)
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Enter valid registration year."
    );

  if (
    Number(vehicleData.registrationYear) < 1950 ||
    Number(vehicleData.registrationYear) > new Date().getFullYear()
  )
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Enter valid registration year."
    );

  if (!Array.isArray(services) || services.length === 0)
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "At least one service must be selected"
    );

  if (!vehicleData.fuelType)
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Select a valid fuel-type of your vehicle."
    );

  if (!garage || !garageUID)
    throw new AppError(HttpStatus.BAD_REQUEST, "Garage selection is required");

  if (!date || isNaN(Date.parse(date)))
    throw new AppError(HttpStatus.BAD_REQUEST, "Invalid appointment date");

  if (!time?.slotId || !time?.startTime)
    throw new AppError(HttpStatus.BAD_REQUEST, "Invalid time slot selected");

  if (!Array.isArray(slotIds) || slotIds.length === 0)
    throw new AppError(HttpStatus.BAD_REQUEST, "Slot IDs are required");

  if (!totalDuration || totalDuration <= 0)
    throw new AppError(
      HttpStatus.BAD_REQUEST,
      "Invalid total service duration"
    );
};
