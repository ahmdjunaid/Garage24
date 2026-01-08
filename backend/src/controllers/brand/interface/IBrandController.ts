import { Request, Response } from "express";

export interface IBrandController {
    getAllBrands(req:Request, res:Response): Promise<void>;
}