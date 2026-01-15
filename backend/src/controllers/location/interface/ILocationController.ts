import {Request, Response} from "express"

export interface ILocationController {
    getAddressFromCoordinates(req:Request, res:Response): Promise<void>;
    getCoordinatesFromName(req:Request, res:Response): Promise<void>;
}