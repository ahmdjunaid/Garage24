import { IReview, ReviewDocument } from "../../../models/review";
import { GetPaginationQuery } from "../../../types/common";
import { PaginatedReviewResponse } from "../../../types/review";

export interface IReviewService {
    createReview(data:Partial<IReview>): Promise<ReviewDocument>;
    getPaginatedReview(query:GetPaginationQuery): Promise<PaginatedReviewResponse>;
}