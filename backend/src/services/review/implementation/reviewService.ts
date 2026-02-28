import { inject, injectable } from "inversify";
import { IReview, ReviewDocument } from "../../../models/review";
import { IReviewService } from "../interface/IReviewService";
import { TYPES } from "../../../DI/types";
import { IReviewRepository } from "../../../repositories/review/interface/IReviewRepository";
import { IAppointmentRepository } from "../../../repositories/appointment/interface/IAppointmentRepository";
import { AppError } from "../../../middleware/errorHandler";
import HttpStatus from "../../../constants/httpStatusCodes";
import { Types } from "mongoose";
import { GetPaginationQuery } from "../../../types/common";
import { PaginatedReviewResponse } from "../../../types/review";

@injectable()
export class ReviewService implements IReviewService {
  constructor(
    @inject(TYPES.ReviewRepository)
    private _reviewRepository: IReviewRepository,
    @inject(TYPES.AppointmentRepository)
    private _appointmentRepository: IAppointmentRepository
  ) {}

  async createReview(data: Partial<IReview>): Promise<ReviewDocument> {
    const appointment = await this._appointmentRepository.getAppointmentDoc(
      data.appointmentId!.toString()
    );
    if (!appointment || appointment.status !== "completed") {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Review is not allowd in this stage."
      );
    }

    const convertedAppointmentId = new Types.ObjectId(data.appointmentId);

    const isReviewed = await this._reviewRepository.getReviewById(
      convertedAppointmentId
    );

    if (isReviewed) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        "Only one review is allowed per appointment"
      );
    }

    const reviewDoc = await this._reviewRepository.createReview({
      ...data,
      garageId: appointment.garageId,
    });

    await this._appointmentRepository.insertRating(
      appointment._id,
      data.rating!
    );

    return reviewDoc;
  }

  async getPaginatedReview(query: GetPaginationQuery): Promise<PaginatedReviewResponse> {
      return await this._reviewRepository.getPaginatedReviews(query)
  }
}
