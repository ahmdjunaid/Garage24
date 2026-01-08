import { Request, Response } from "express";

export interface IVehicleModelController {
    getAllVehicleModels(req:Request, res:Response): Promise<void>;
}