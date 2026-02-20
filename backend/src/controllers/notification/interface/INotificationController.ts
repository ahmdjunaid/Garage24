import { NextFunction, Request, Response } from "express";

export interface INotificationController {
  getNotificationByUserId(req:Request, res: Response, next: NextFunction): Promise<void>;
  markAsRead(req:Request, res: Response, next: NextFunction): Promise<void>;
  markAllAsRead(req:Request, res: Response, next: NextFunction): Promise<void>;
}
