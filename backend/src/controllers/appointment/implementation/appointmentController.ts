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
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class AppointmentController implements IAppointmentController {
  constructor(
    @inject(TYPES.ServiceCategoryService)
    private _serviceCategoryService: IServiceCategoryService,
    @inject(TYPES.BrandService) private _brandService: IBrandService,
    @inject(TYPES.AppointmentService)
    private _appointmentService: IAppointmentService
  ) {}

  getAppointmentMetaData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const [categories, brands] = await Promise.all([
        this._serviceCategoryService.getAllServiceCategories(),
        this._brandService.getAllBrands(),
      ]);

      res.status(HttpStatus.OK).json({ categories, brands });
    } catch (error) {
      next(error);
    }
  };

  createAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED)
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
      next(error);
    }
  };

  getActiveAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
      next(error);
    }
  };
}
