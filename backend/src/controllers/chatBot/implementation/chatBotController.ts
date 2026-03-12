import { inject, injectable } from "inversify";
import { IChatBotController } from "../interface/IChatBotController";
import { TYPES } from "../../../DI/types";
import { IChatBotService } from "../../../services/chatBot/interface/IChatBotServices";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { INVALID_INPUT } from "../../../constants/messages";

@injectable()
export class ChatBotController implements IChatBotController {
  constructor(
    @inject(TYPES.ChatBotService) private _chatBotService: IChatBotService
  ) {}

  chatWithBot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message } = req.body;

      if ( !message )
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT);

      const replay = await this._chatBotService.chatWithBot(message);

      res.status(HttpStatus.OK).json(replay);
    } catch (error) {
      next(error);
    }
  };
}
