import { Request, Response, NextFunction } from "express";
import { IContactController } from "../interface/IContactController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IEmailService } from "../../../services/email/interface/IEmailService";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED } from "../../../constants/messages";

@injectable()
export class ContactController implements IContactController {
  constructor(
    @inject(TYPES.EmailService) private _emailService: IEmailService
  ) {}

  sendContactFormEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !phone || !message) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._emailService.sendContactFormEmail(
        name,
        email,
        phone,
        message
      );

      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      next(error);
    }
  };
}
