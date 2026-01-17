import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED } from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";
import IAdminController from "../interface/IAdminController";
import IAdminService from "../../../services/superAdmin/interface/IAdminService";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService) private _adminService: IAdminService
  ) {}

  getAllGarages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;

      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response = await this._adminService.getAllGarages(query);

      res.status(HttpStatus.OK).json({
        garages: response.garages,
        totalGarages: response.totalGarages,
        totalPages: response.totalPages,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;

      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response = await this._adminService.getAllUsers(query);

      res.status(HttpStatus.OK).json({
        users: response.users,
        totalUsers: response.totalUsers,
        totalPages: response.totalPages,
      });
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { action } = req.body;
      const userId = req.params.userId;

      if (!userId || !action) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._adminService.toggleStatus(userId, action);

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  garageApproval = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { action } = req.body;
      const userId = req.params.userId;

      if (!userId || !action) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._adminService.garageApproval(userId, action);

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };
}
