import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAppointmentController } from "../interface/IAppointmentController";
import { TYPES } from "../../../DI/types";
import { IServiceCategoryService } from "../../../services/serviceCategory/interface/IServiceCategoryService";
import { IBrandService } from "../../../services/brand/interface/IBrandService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IAppointmentService } from "../../../services/appointment/interface/IAppointmentService";
import { ALL_FIELDS_REQUIRED } from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";

@injectable()
export class AppointmentController implements IAppointmentController {
  constructor(
    @inject(TYPES.ServiceCategoryService)
    private _serviceCategoryService: IServiceCategoryService,
    @inject(TYPES.BrandService) private _brandService: IBrandService,
    @inject(TYPES.AppointmentService)
    private _appointmentService: IAppointmentService
  ) {}

  getAppointmentMetaData = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [categories, brands] = await Promise.all([
        this._serviceCategoryService.getAllServiceCategories(),
        this._brandService.getAllBrands(),
      ]);

      res.status(HttpStatus.OK).json({ categories, brands });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || "Error while fetching data." });
    }
  };

  createAppointment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { userData, vehicleData, services, garage, date, time } = req.body;

      if (
        !userData ||
        !vehicleData ||
        !services ||
        !garage ||
        !date ||
        !time ||
        !userId
      ) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._appointmentService.createAppointment({
        userId,
        vehicleData,
        services,
        garageId: garage,
        slotIds: [time.slotId],
        appointmentDate: date,
        startTime: time.startTime,
        mobileNumber: userData.mobileNumber,
      });

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || "Error while fetching data." });
    }
  };

  getActiveAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;
      const garageId = req.user?.id;

      const query: GetPaginationQuery = {
        id: String(garageId),
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response =
        await this._appointmentService.getActiveAppointments(query);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || "Error while fetching data." });
    }
  };
}
