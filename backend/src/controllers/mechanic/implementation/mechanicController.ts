import { NextFunction, Request, Response } from "express";
import IMechanicController from "../interface/IMechanicController";
import IMechanicService from "../../../services/mechanic/interface/IMechanicService";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  INVALID_INPUT
} from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class MechanicController implements IMechanicController {
  constructor(
    @inject(TYPES.MechanicService) private _mechanicService: IMechanicService
  ) {}

  onboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, userId, skills, mobile, password, newPassword } = req.body;
      const image = req.file as Express.Multer.File;

      if (!name || !userId || !skills || !mobile || !image) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
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
      next(error);
    }
  };

  registerMechanic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, email, role } = req.body;
      const garageId = req.user?.id;
      const allowedMechanics = req.plan.noOfMechanics;

      if (!name || !email || !role || !garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._mechanicService.registerMechanic(
        name,
        email,
        role,
        garageId,
        allowedMechanics
      );

      res.status(HttpStatus.OK).json({ response });
    } catch (error) {
      next(error);
    }
  };

  getAllMechanics = async (req: Request, res: Response, next: NextFunction) => {
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

      const response = await this._mechanicService.toggleStatus(userId, action);

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  deleteMechanic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._mechanicService.deleteUser(userId);
      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  resendMechanicInvite = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const mechanicId = req.params.mechanicId;
      if (!mechanicId) {
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT);
      }

      const { message } =
        await this._mechanicService.resendMechanicInvite(mechanicId);

      res.status(HttpStatus.ACCEPTED).json({ message });
    } catch (error) {
      next(error);
    }
  };

  getAssignableMechanics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const garageId = req.params.garageId
      if(!garageId){
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED)
      }

      const response = await this._mechanicService.getAssignableMechanics(garageId)
      res.status(HttpStatus.OK).json(response)

    } catch (error) {
      next(error)
    }
  }
}
