import { Request, Response } from "express";
import IMechanicController from "../interface/IMechanicController";
import IMechanicService from "../../../services/mechanic/interface/IMechanicService";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  INVALID_INPUT,
  SERVER_ERROR,
} from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";

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

  registerMechanic = async (req: Request, res: Response) => {
    try {
      const { name, email, role } = req.body;
      const garageId = req.user?.id;

      if (!name || !email || !role || !garageId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._mechanicService.registerMechanic(
        name,
        email,
        role,
        garageId
      );

      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      console.error(error, "Error from register");
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getAllMechanics = async (req: Request, res: Response) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;
      const garageId = req.user?.id;

      const query: GetPaginationQuery = {
        id: String(garageId),
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response = await this._mechanicService.getAllMechanics(query);

      res.status(HttpStatus.OK).json({
        mechanics: response.mechanics,
        totalMechanics: response.totalMechanics,
        totalPages: response.totalPages,
      });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  toggleStatus = async (req: Request, res: Response) => {
    try {
      const { action } = req.body;
      const userId = req.params.userId;

      if (!userId || !action) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._mechanicService.toggleStatus(userId, action);

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  deleteMechanic = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      console.log(userId)

      if (!userId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._mechanicService.deleteUser(userId);
      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  resendMechanicInvite = async (req: Request, res: Response) => {
    try {
      const mechanicId = req.params.mechanicId;
      if (!mechanicId) {
        throw { status: HttpStatus.BAD_REQUEST, message: INVALID_INPUT };
      }

      const { message } = await this._mechanicService.resendMechanicInvite(mechanicId)

      res.status(HttpStatus.ACCEPTED).json({message})

    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };
}
