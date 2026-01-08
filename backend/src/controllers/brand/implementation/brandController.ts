import { Request, Response } from "express";
import { IBrandController } from "../interface/IBrandController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IBrandService } from "../../../services/brand/interface/IBrandService";
import HttpStatus from "../../../constants/httpStatusCodes";
import { SERVER_ERROR } from "../../../constants/messages";

@injectable()
export class BrandController implements IBrandController {
  constructor(
    @inject(TYPES.BrandService) private _brandService: IBrandService
  ) {}
  getAllBrands = async (req: Request, res: Response) => {
    try {
      const brand = await this._brandService.getAllBrands();

      res.status(HttpStatus.OK).json(brand)
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err?.message || SERVER_ERROR });
    }
  };
}
