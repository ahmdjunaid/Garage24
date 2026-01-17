import { NextFunction, Request, Response } from "express";
import { IServiceCategoryController } from "../interface/IServiceCategoryController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import HttpStatus from "../../../constants/httpStatusCodes";
import { SERVER_ERROR } from "../../../constants/messages";
import { IServiceCategoryService } from "../../../services/serviceCategory/interface/IServiceCategoryService";

@injectable()
export class ServiceCategoryController implements IServiceCategoryController {
  constructor(
    @inject(TYPES.ServiceCategoryService)
    private _serviceCatgoryService: IServiceCategoryService
  ) {}

  getAllServiceCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const serviceCategories = await this._serviceCatgoryService.getAllServiceCategories()

    res.status(HttpStatus.OK).json(serviceCategories)
    } catch (error) {
      console.error(error);
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message || SERVER_ERROR });
    }
  };
}
