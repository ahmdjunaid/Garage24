import { Request, Response } from "express";
import IMechanicController from "../../interface/controller/mechanic/IMechanicController";
import IMechanicService from "../../interface/services/mechanic/IMechanicService";
import HttpStatus from "../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../constants/messages";

export class MechanicController implements IMechanicController {
  constructor(private _mechanicService: IMechanicService) {}

  onboarding = async (req: Request, res: Response) => {
    try {
      const {
        userId,
        skills,
        image,
        mobile,
        password,
        newPassword
      } = req.body;

      if ( !userId || !skills || !image || !mobile ) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }
      const response = await this._mechanicService.onboarding(
        userId,
        skills,
        image,
        mobile,
        password,
        newPassword
      );
      res.status(HttpStatus.OK).json({ mechanic: response.mechanic });
    } catch (error) {
      console.error(error,'Error from onboariding')
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  register = async (req: Request, res: Response) => {
      try {
        const { garageId, userId } = req.body

        if(!garageId || !userId){
          throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
        }

        const response = await this._mechanicService.register(garageId, userId)

        res.status(HttpStatus.OK).json({response})
        
      } catch (error) {
        console.error(error,'Error from register')
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  }
}
