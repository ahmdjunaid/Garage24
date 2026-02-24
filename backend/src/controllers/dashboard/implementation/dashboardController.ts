import { inject, injectable } from "inversify";
import { IDashboardController } from "../interface/IDashboardController";
import { TYPES } from "../../../DI/types";
import { IDashboardService } from "../../../services/dashboard/interface/IDashboardService";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { AppError } from "../../../middleware/errorHandler";

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

      const response =
        await this._dashboardService.getAdminDashboardData(type);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTopFiveBookedGarages = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const response = await this._dashboardService.getTopFiveGarages()
        res.status(HttpStatus.OK).json(response)
      } catch (error) {
        next(error)
      }
  }
}
