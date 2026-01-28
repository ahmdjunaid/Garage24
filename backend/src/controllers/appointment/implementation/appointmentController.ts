import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAppointmentController } from "../interface/IAppointmentController";
import { TYPES } from "../../../DI/types";
import { IServiceCategoryService } from "../../../services/serviceCategory/interface/IServiceCategoryService";
import { IBrandService } from "../../../services/brand/interface/IBrandService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { IAppointmentService } from "../../../services/appointment/interface/IAppointmentService";
import { GetPaginationQuery } from "../../../types/common";
import { AppError } from "../../../middleware/errorHandler";
import { validateCreateAppointment } from "../../../utils/validateAppointmentData";
import {
  ALL_FIELDS_REQUIRED,
  USER_ID_REQUIRED,
} from "../../../constants/messages";

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
      validateCreateAppointment(req.body);

      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(HttpStatus.UNAUTHORIZED, "User not authenticated");
      }

      const response = await this._appointmentService.createAppointment(
        userId,
        req.body
      );

      res.status(HttpStatus.CREATED).json(response);
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

  getAppointmentDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId)
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);

      const response =
        await this._appointmentService.getAppointmentDetails(appointmentId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllAppointmentsByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, USER_ID_REQUIRED);
      }

      const query: GetPaginationQuery = {
        id: String(userId),
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response =
        await this._appointmentService.getAllAppointmentsByUserId(query);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  cancelAppointment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointmentId = req.params.appointmentId;

      if (!appointmentId) {
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Appointment id is required."
        );
      }

      const response =
        await this._appointmentService.cancelAppointment(appointmentId);

      res.status(HttpStatus.ACCEPTED).json(response);
    } catch (error) {
      next(error);
    }
  };
}
