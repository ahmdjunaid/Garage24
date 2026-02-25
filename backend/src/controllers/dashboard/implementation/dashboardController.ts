import { inject, injectable } from "inversify";
import { IDashboardController } from "../interface/IDashboardController";
import { TYPES } from "../../../DI/types";
import { IDashboardService } from "../../../services/dashboard/interface/IDashboardService";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandler";
import { AUTHENTICATION_FAILED } from "../../../constants/messages";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(
    @inject(TYPES.DashboardService) private _dashboardService: IDashboardService
  ) {}

  adminDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const cycleType = req.query.type as string;

      const allowedTypes = ["week", "month", "year"];

      if (!cycleType || !allowedTypes.includes(cycleType))
        throw new AppError(HttpStatus.BAD_REQUEST, "Invalid cycle");

      const type = cycleType as "week" | "month" | "year";

      const response = await this._dashboardService.getAdminDashboardData(type);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTopFiveBookedGarages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const response = await this._dashboardService.getTopFiveGarages();
      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getGarageDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const cycleType = req.query.type as string;
      const garageId = req.user?.id;
      const allowedTypes = ["week", "month", "year"];

      if (!garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);
      }

      if (!cycleType || !allowedTypes.includes(cycleType))
        throw new AppError(HttpStatus.BAD_REQUEST, "Invalid cycle");

      const type = cycleType as "week" | "month" | "year";

      const response = await this._dashboardService.getGarageDashboardData(
        garageId,
        type
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTopFiveBookedServices = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const garageId = req.user?.id;

      if (!garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);
      }

      const response =
        await this._dashboardService.getTopFiveServices(garageId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getMechanicDashboardData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const cycleType = req.query.type as string;
      const mechanicId = req.user?.id;
      const allowedTypes = ["week", "month", "year"];


      if (!mechanicId) {
        throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);
      }

      if (!cycleType || !allowedTypes.includes(cycleType))
        throw new AppError(HttpStatus.BAD_REQUEST, "Invalid cycle");

      const type = cycleType as "week" | "month" | "year";

      const response = await this._dashboardService.getMechanicDashboardData(
        mechanicId,
        type
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
