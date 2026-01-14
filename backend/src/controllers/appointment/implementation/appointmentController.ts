import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAppointmentController } from "../interface/IAppointmentController";
import { TYPES } from "../../../DI/types";
import { IServiceCategoryService } from "../../../services/serviceCategory/interface/IServiceCategoryService";
import { IBrandService } from "../../../services/brand/interface/IBrandService";
import HttpStatus from "../../../constants/httpStatusCodes";

@injectable()
export class AppointmentController implements IAppointmentController {
  constructor(
    @inject(TYPES.ServiceCategoryService)
    private _serviceCategoryService: IServiceCategoryService,
    @inject(TYPES.BrandService) private _brandService: IBrandService
  ) {}

  getAppointmentMetaData = async (req: Request, res: Response) => {
    try {
      const [categories, brands] = await Promise.all([
        this._serviceCategoryService.getAllServiceCategories(),
        this._brandService.getAllBrands(),
      ]);

      res.status(HttpStatus.OK).json({categories, brands})
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || "Error while fetching data." });
    }
  };
}
