import { Request, Response } from "express";

export interface IVehicleModelController {
    getAllVehicleModelsByBrand(req:Request, res:Response): Promise<void>;
}