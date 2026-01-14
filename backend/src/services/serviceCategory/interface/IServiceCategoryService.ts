import { ServiceCategoryDocument } from "../../../models/serviceCategory";

export interface IServiceCategoryService {
  getAllServiceCategories(): Promise<ServiceCategoryDocument[] | null>;
}
