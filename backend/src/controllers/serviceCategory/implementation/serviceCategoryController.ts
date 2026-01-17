import { NextFunction, Request, Response } from "express";
import { IServiceCategoryController } from "../interface/IServiceCategoryController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import HttpStatus from "../../../constants/httpStatusCodes";
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
      next(error)
    }
  };
}
