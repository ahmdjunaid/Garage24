import { injectable } from "inversify";
import {
  IServiceCategory,
  ServiceCategory,
  ServiceCategoryDocument,
} from "../../../models/serviceCategory";
import { BaseRepository } from "../../IBaseRepository";
import { IServiceCategoryRepository } from "../interface/IServiceCategoryRepository";

@injectable()
export class ServiceCategoryRepository
  extends BaseRepository<IServiceCategory>
  implements IServiceCategoryRepository
{
  constructor() {
    super(ServiceCategory);
  }

  async getAllServiceCategories(): Promise<ServiceCategoryDocument[] | null> {
    return await this.getAll({ isDeleted: false, isBlocked: false });
  }
}
