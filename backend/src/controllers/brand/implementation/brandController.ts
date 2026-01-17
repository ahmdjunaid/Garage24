import { NextFunction, Request, Response } from "express";
import { IBrandController } from "../interface/IBrandController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IBrandService } from "../../../services/brand/interface/IBrandService";
import HttpStatus from "../../../constants/httpStatusCodes";

@injectable()
export class BrandController implements IBrandController {
  constructor(
    @inject(TYPES.BrandService) private _brandService: IBrandService
  ) {}
  getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brand = await this._brandService.getAllBrands();

      res.status(HttpStatus.OK).json(brand)
    } catch (error) {
      next(error)
    }
  };
}
