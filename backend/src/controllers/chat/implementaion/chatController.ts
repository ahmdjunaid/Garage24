import { Request, Response, NextFunction } from "express";
import { IChatController } from "../interface/IChatController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IChatService } from "../../../services/chat/interface/IChatServices";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { INVALID_INPUT } from "../../../constants/messages";
import { FilterQuery } from "mongoose";
import { AppointmentFilterForChat } from "../../../types/chat";

@injectable()
export class ChatController implements IChatController {
  constructor(@inject(TYPES.ChatService) private _chatService: IChatService) {}

  getAppointmentsForChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mechanicId = req.query.mechanicId as string;
      const garageId = req.query.garageId as string;

      if (!mechanicId && !garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT);
      }

      const filter: FilterQuery<AppointmentFilterForChat> = {};

      if (mechanicId) {
        filter.mechanicId = mechanicId;
      }

      if (garageId) {
        filter.garageUID = garageId;
      }

      const response = await this._chatService.getAppointmentsForChat(filter);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getMessagesByAppointmentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const appointmentId = req.params.appointmentId;
      if (!appointmentId)
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT);

      const response = await this._chatService.getMessages(appointmentId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAppointmentForChatById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointmentId = req.params.appointmentId
      if(!appointmentId) throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT)
      
      const response = await this._chatService.getAppointmentsForChatById(appointmentId)

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error)
    }
  }
}
