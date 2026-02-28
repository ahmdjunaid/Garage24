import { NextFunction, Request, Response } from "express";

export interface IReviewController {
    createReview(req:Request, res:Response, next: NextFunction): Promise<void>;
    getPaginatedReviews(req:Request, res:Response, next: NextFunction): Promise<void>;
}