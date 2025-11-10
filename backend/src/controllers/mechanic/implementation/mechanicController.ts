import { Request, Response } from "express";
import IMechanicController from "../interface/IMechanicController";
import IMechanicService from "../../../services/mechanic/interface/IMechanicService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../../constants/messages";

export class MechanicController implements IMechanicController {
  constructor(private _mechanicService: IMechanicService) {}

  onboarding = async (req: Request, res: Response) => {
    try {
      const { name, userId, skills, mobile, password, newPassword } = req.body;
      const image = req.file as Express.Multer.File;

      if (!name || !userId || !skills || !mobile || !image) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._mechanicService.onboarding(
        name,
        userId,
        skills,
        image,
        mobile,
        password,
        newPassword
      );

      res.status(HttpStatus.OK).json({ mechanic: response.mechanic });
    } catch (error) {
      console.error(error, "Error from onboariding");
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };
}
