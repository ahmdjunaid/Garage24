import { NextFunction, Request, Response } from "express";
import { INotificationController } from "../interface/INotificationController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { INotificationService } from "../../../services/notification/interface/INotificationService";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { USER_ID_REQUIRED } from "../../../constants/messages";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) {}

  getNotificationByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, USER_ID_REQUIRED);
      }

      const response =
        await this._notificationService.getNotificationByUserId(userId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifId = req.params.notifId;
      if (!notifId)
        throw new AppError(
          HttpStatus.BAD_REQUEST,
          "Notification id is missing"
        );

      const response = await this._notificationService.markAsRead(notifId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id

      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, USER_ID_REQUIRED);
      }

      const response = await this._notificationService.markAllAsRead(userId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
