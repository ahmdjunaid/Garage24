import { Types } from "mongoose";
import { IReview, ReviewDocument } from "../../../models/review";
import { GetPaginationQuery } from "../../../types/common";
import { PaginatedReviewResponse } from "../../../types/review";

export interface IReviewRepository {
    createReview(data:Partial<IReview>): Promise<ReviewDocument>;
    getReviewById(appointmentId:Types.ObjectId): Promise<ReviewDocument | null>;
    getPaginatedReviews(query: GetPaginationQuery): Promise<PaginatedReviewResponse>;
}