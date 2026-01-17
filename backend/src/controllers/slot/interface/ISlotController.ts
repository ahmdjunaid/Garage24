import { NextFunction, Request, Response } from "express"

export interface ISlotController {
    getSlotsByGarageIdAndDate(req:Request, res:Response, next: NextFunction): Promise<void>
}