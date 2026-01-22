import { NextFunction, Request, Response } from "express";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED } from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";
import IUserController from "../interface/IUserController";
import IUserService from "../../../services/user/interface/IUserService";

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private _userService: IUserService
  ) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;

      const query: GetPaginationQuery = {
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response = await this._userService.getAllUsers(query);

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

      const response = await this._userService.toggleStatus(userId, action);

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };
}
