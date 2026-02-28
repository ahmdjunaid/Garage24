import { Types } from "mongoose";
import { IReview, Review, ReviewDocument } from "../../../models/review";
import { BaseRepository } from "../../IBaseRepository";
import { IReviewRepository } from "../interface/IReviewRepository";
import { GetPaginationQuery } from "../../../types/common";
import { PaginatedReviewResponse, TestimonialDoc } from "../../../types/review";

export class ReviewRepository
  extends BaseRepository<IReview>
  implements IReviewRepository
{
  constructor() {
    super(Review);
  }

  async createReview(data: Partial<IReview>): Promise<ReviewDocument> {
    return await this.create(data);
  }

  async getReviewById(
    appointmentId: Types.ObjectId
  ): Promise<ReviewDocument | null> {
    return await this.model.findOne({ appointmentId });
  }

  async getPaginatedReviews(
    query: GetPaginationQuery
  ): Promise<PaginatedReviewResponse> {
    const skip = (query.page - 1) * query.limit;

    const docs = await this.model
      .find({})
      .populate([
        {
          path: "garageId",
          select: "name",
        },
        {
          path: "appointmentId",
          select: "services",
          populate: {
            path: "services",
            select: "name",
          },
        },
        {
          path: "userId",
          select: "name imageUrl",
        },
      ])
      .skip(skip)
      .limit(query.limit)
      .sort({ createdAt: -1 })
      .lean<TestimonialDoc[]>();

    const totalDocs = await this.model.countDocuments({});
    const totalPages = Math.ceil(totalDocs / query.limit);

    return { docs, totalDocs, totalPages };
  }
}
