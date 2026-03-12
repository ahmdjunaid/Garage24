import { NextFunction, Request, Response } from "express";

export interface IChatBotController {
    chatWithBot(req:Request, res:Response, next:NextFunction): Promise<void>;
}