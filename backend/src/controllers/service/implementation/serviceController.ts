import { NextFunction, Request, Response } from "express";
import IServiceController from "../interface/IServiceController";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  INVALID_INPUT,
} from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IServiceService from "../../../services/service/interface/IServiceService";
import { GetPaginationQuery } from "../../../types/common";
import { AppError } from "../../../middleware/errorHandler";

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject(TYPES.ServiceService) private _serviceService: IServiceService
  ) {}

  createService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { categoryId, name, price, durationMinutes } = req.body;
      const garageId = req.user?.id;

      if (!categoryId || !name || !price || !durationMinutes || !garageId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._serviceService.createService({
        ...req.body,
        garageId,
      });

      res.status(HttpStatus.ACCEPTED).json(response);
    } catch (error) {
      next(error);
    }
  };

  getAllServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10, searchQuery = "" } = req.query;
      const garageId = req.user?.id;

      const query: GetPaginationQuery = {
        id: String(garageId),
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response = await this._serviceService.getAllServices(query);

      res.status(HttpStatus.OK).json({ ...response });
    } catch (error) {
      next(error);
    }
  };

  toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { action } = req.body;
      const serviceId = req.params.serviceId;

      if (!serviceId || !action) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._serviceService.toggleStatus(
        serviceId,
        action
      );

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  deleteService = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const serviceId = req.params.serviceId;

      if (!serviceId) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      const response = await this._serviceService.deleteService(serviceId);
      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  };

  getServicesByGarageId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const garageId = req.query.garageId as string;
      const categoryId = req.query.categoryId as string;
      if (!garageId || !categoryId) {
        throw new AppError(HttpStatus.BAD_REQUEST, INVALID_INPUT);
      }
      const response = await this._serviceService.getServicesByGarageId(
        garageId,
        categoryId
      );

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };
}
