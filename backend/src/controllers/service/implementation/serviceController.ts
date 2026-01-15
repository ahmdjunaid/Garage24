import { Request, Response } from "express";
import IServiceController from "../interface/IServiceController";
import HttpStatus from "../../../constants/httpStatusCodes";
import { ALL_FIELDS_REQUIRED, SERVER_ERROR } from "../../../constants/messages";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import IServiceService from "../../../services/service/interface/IServiceService";
import { GetPaginationQuery } from "../../../types/common";

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject(TYPES.ServiceService) private _serviceService: IServiceService
  ) {}

  createService = async (req: Request, res: Response) => {
    try {
      const { categoryId, name, price, durationMinutes } = req.body;
      const garageId = req.user?.id;

      if (!categoryId || !name || !price || !durationMinutes || !garageId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._serviceService.createService({
        ...req.body,
        garageId,
      });

      res.status(HttpStatus.ACCEPTED).json(response);
    } catch (error) {
      console.error(error, "Error from creating service");
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getAllServices = async (req: Request, res: Response) => {
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
      const serviceId = req.params.serviceId;

      if (!serviceId || !action) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._serviceService.toggleStatus(
        serviceId,
        action
      );

      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  deleteService = async (req: Request, res: Response) => {
    try {
      const serviceId = req.params.serviceId;

      if (!serviceId) {
        throw { status: HttpStatus.BAD_REQUEST, message: ALL_FIELDS_REQUIRED };
      }

      const response = await this._serviceService.deleteService(serviceId);
      res.status(HttpStatus.ACCEPTED).json({ message: response.message });
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };

  getServicesByGarageId = async (req: Request, res: Response) => {
    try {
      const garageId = req.query.garageId as string;
      const categoryId = req.query.categoryId as string;
      if(!garageId || !categoryId){
        throw {status:HttpStatus.BAD_REQUEST, message: "Garage Id is required"}
      }
      const response = await this._serviceService.getServicesByGarageId(garageId, categoryId)

      res.status(HttpStatus.OK).json(response)
      
    } catch (error) {
            console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  }
}
