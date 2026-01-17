import { NextFunction, Request, Response } from "express";

export interface IServiceCategoryController {
    getAllServiceCategories(req:Request, res:Response, next: NextFunction): Promise<void>
}