import { Request, Response, NextFunction } from "express";
import { IReviewController } from "../interface/IReviewController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../DI/types";
import { IReviewService } from "../../../services/review/interface/IReviewService";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import {
  ALL_FIELDS_REQUIRED,
  AUTHENTICATION_FAILED,
} from "../../../constants/messages";
import { Types } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";

@injectable()
export class ReviewController implements IReviewController {
  constructor(
    @inject(TYPES.ReviewService) private _reviewService: IReviewService
  ) {}

  createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { appointmentId, review, rating } = req.body;
      const userId = req.user?.id;

      if (!appointmentId || !review || !rating) {
        throw new AppError(HttpStatus.BAD_REQUEST, ALL_FIELDS_REQUIRED);
      }

      if (!userId)
        throw new AppError(HttpStatus.BAD_REQUEST, AUTHENTICATION_FAILED);
      const convertedUserId = new Types.ObjectId(userId);

      const response = await this._reviewService.createReview({
        appointmentId,
        userId: convertedUserId,
        rating,
        review,
      });

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
      next(error);
    }
  };

  getPaginatedReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 3, searchQuery = "" } = req.query;
      const garageId = req.user?.id;

      const query: GetPaginationQuery = {
        id: String(garageId),
        page: Number(page),
        limit: Number(limit),
        searchQuery: String(searchQuery),
      };

      const response =
        await this._reviewService.getPaginatedReview(query);

      res.status(HttpStatus.OK).json(response);
    } catch (error) {
        next(error);
    }
  }
}
