import { Request, Response } from "express";
import IGarageController from "../interface/IGarageController";
import IGarageService from "../../../services/garage/interface/IGarageService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../../constants/messages";
import { GetPaginationQuery } from "../../../types/common";

export class GarageController implements IGarageController {
  constructor(private _garageService: IGarageService) {}

  onboarding = async (req: Request, res: Response) => {
    try {
      const { name, garageId, plan, startTime, endTime, mobile, isRSAEnabled } =
        req.body;
      const location = JSON.parse(req.body.location);
      const address = JSON.parse(req.body.address);
      const selectedHolidays = JSON.parse(req.body.selectedHolidays);
      const image = req.file as Express.Multer.File;

      if (
        !name ||
        !garageId ||
        !location ||
        !plan ||
        !startTime ||
        !endTime ||
        !selectedHolidays ||
        !image ||
        !mobile ||
        !isRSAEnabled ||
        !address
      ) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._garageService.onboarding(
        name,
        garageId,
        location,
        address,
        plan,
        startTime,
        endTime,
        selectedHolidays,
        image,
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

      const response = await this._garageService.getAllMechanics(query);

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

      const response = await this._garageService.toggleStatus(userId, action);

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

      if (!userId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._garageService.deleteUser(userId)
      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  }
}
