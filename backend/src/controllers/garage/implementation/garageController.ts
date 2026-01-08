import { Request, Response } from "express";
import IGarageController from "../interface/IGarageController";
import IGarageService from "../../../services/garage/interface/IGarageService";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  ERROR_WHILE_FETCH_DATA,
  SERVER_ERROR,
  USER_ID_REQUIRED,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";

@injectable()
export class GarageController implements IGarageController {
  constructor(
    @inject(TYPES.GarageService) private _garageService: IGarageService
  ) {}

  onboarding = async (req: Request, res: Response) => {
    try {
      const { name, userId, startTime, endTime, mobile, isRSAEnabled } =
        req.body;
      const location = JSON.parse(req.body.location);
      const address = JSON.parse(req.body.address);
      const selectedHolidays = JSON.parse(req.body.selectedHolidays);

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
        !address
      ) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
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
        isRSAEnabled
      );
      res.status(HttpStatus.OK).json({ garage: response });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getAddressFromCoordinates = async (req: Request, res: Response) => {
    try {
      const lat = req.query.lat as string;
      const lng = req.query.lng as string;

      if (!lat || !lng) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: "Latitude and Longitude cannot be blank.",
        };
      }
      const response = await this._garageService.getAddressFromCoordinates(
        lat,
        lng
      );
      res.json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getApprovalStatus = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw { status: HttpStatus.BAD_REQUEST, message: USER_ID_REQUIRED };
      }

      const data = await this._garageService.getApprovalStatus(userId);

      res.status(HttpStatus.OK).json(data);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getCurrentPlan = async (req: Request, res: Response) => {
    try {
      const garageId = req.params.garageId;
      if (!garageId) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          message: ERROR_WHILE_FETCH_DATA,
        };
      }

      const response = await this._garageService.getCurrentPlan(garageId);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getGarageById = async (req: Request, res: Response) => {
    try {
      const garageId = req.query.garageId as string;

      if (!garageId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const garageData = await this._garageService.getGarageById(garageId);

      res.status(HttpStatus.OK).json(garageData);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getGarageDetailsById = async (req: Request, res: Response) => {
    try {
      const garageId = req.query.garageId as string;

      if (!garageId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const garageData = await this._garageService.getGarageDetails(garageId);

      res.status(HttpStatus.OK).json(garageData);
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  }
}
