import { Request, Response } from "express"

export interface ISlotController {
    getSlotsByGarageIdAndDate(req:Request, res:Response): Promise<void>
}