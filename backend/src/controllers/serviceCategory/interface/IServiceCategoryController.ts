import { Request, Response } from "express";

export interface IServiceCategoryController {
    getAllServiceCategories(req:Request, res:Response): Promise<void>
}