import { injectable } from "inversify";
import { Brand, BrandDocument, IBrand } from "../../../models/brands";
import { BaseRepository } from "../../IBaseRepository";
import { IBrandRepository } from "../interface/IBrandRepository";

@injectable()
export class BrandRepository
  extends BaseRepository<IBrand>
  implements IBrandRepository
{
  constructor() {
    super(Brand);
  }
  async getAllBrands(): Promise<BrandDocument[]> {
    return await this.getAll({ isDeleted: false, isBlocked: false });
  }
}
