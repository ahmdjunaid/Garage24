import { NextFunction, Request, Response } from "express";

export interface IVehicleModelController {
    getAllVehicleModelsByBrand(req:Request, res:Response, next: NextFunction): Promise<void>;
}