import { NextFunction, Request, Response } from "express";
import IGarageController from "../interface/IGarageController";
import IGarageService from "../../../services/garage/interface/IGarageService";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  ERROR_WHILE_FETCH_DATA,
  POINTS_MISSING,
  USER_ID_REQUIRED,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class GarageController implements IGarageController {
  constructor(
    @inject(TYPES.GarageService) private _garageService: IGarageService
  ) {}

  onboarding = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        userId,
        startTime,
        endTime,
        mobile,
        isRSAEnabled,
        numOfServiceBays,
      } = req.body;
      const location = JSON.parse(req.body.location);
      const address = JSON.parse(req.body.address);
      const selectedHolidays = JSON.parse(req.body.selectedHolidays);
      const supportedFuelTypes = JSON.parse(req.body.supportedFuelTypes);

      let image: Express.Multer.File | undefined;
      let document: Express.Multer.File | undefined;

      if (req.files && !Array.isArray(req.files)) {
        image = req.files["image"]?.[0] as Express.Multer.File;
        document = req.files["document"]?.[0] as Express.Multer.File;
      }
      if (
        !name ||
        !userId ||
        !location ||
        !startTime ||
        !endTime ||
        !selectedHolidays ||
        !image ||
        !document ||
        !mobile ||
        !isRSAEnabled ||
        !address ||
        !numOfServiceBays ||
        !supportedFuelTypes
      ) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._garageService.onboarding(
        name,
        userId,
        location,
        address,
        startTime,
        endTime,
        selectedHolidays,
        image,
        document,
        mobile,
        isRSAEnabled,
        numOfServiceBays,
        supportedFuelTypes
      );
      res.status(HttpStatus.OK).json({ garage: response });
    } catch (error) {
      next(error);
    }
  };

  getApprovalStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError(HttpStatus.BAD_REQUEST, USER_ID_REQUIRED);
      }

      const data = await this._garageService.getApprovalStatus(userId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      next(error);
    }
  };

  getCurrentPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const garageId = req.params.garageId;
      if (!garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ERROR_WHILE_FETCH_DATA);
      }

      const response = await this._garageService.getCurrentPlan(garageId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getGarageById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const garageId = req.query.garageId as string;

      if (!garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const garageData = await this._garageService.getGarageById(garageId);

      res.status(HttpStatus.OK).json(garageData);
    } catch (error) {
      next(error);
    }
  };

  getGarageDetailsById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const garageId = req.query.garageId as string;

      if (!garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const garageData = await this._garageService.getGarageDetails(garageId);

      res.status(HttpStatus.OK).json(garageData);
    } catch (error) {
      next(error);
    }
  };

  findNearbyGarages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const lat = Number(req.query.lat);
      const lng = Number(req.query.lng);

      if (!lat || !lng) {
        throw new AppError(HttpStatus.BAD_REQUEST, POINTS_MISSING);
      }

      const response = await this._garageService.findNearbyGarages(lat, lng);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
