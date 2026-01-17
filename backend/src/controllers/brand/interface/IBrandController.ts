import { NextFunction, Request, Response } from "express";

export interface IBrandController {
    getAllBrands(req:Request, res:Response, next: NextFunction): Promise<void>;
}