import { ServiceCategoryDocument } from "../../../models/serviceCategory";

export interface IServiceCategoryRepository {
  getAllServiceCategories(): Promise<ServiceCategoryDocument[] | null>;
}
