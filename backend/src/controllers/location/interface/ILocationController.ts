import {NextFunction, Request, Response} from "express"

export interface ILocationController {
    getAddressFromCoordinates(req:Request, res:Response, next: NextFunction): Promise<void>;
    getCoordinatesFromName(req:Request, res:Response, next: NextFunction): Promise<void>;
}