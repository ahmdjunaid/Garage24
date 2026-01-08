import { BrandDocument } from "../../../models/brands";

export interface IBrandRepository {
    getAllBrands(): Promise<BrandDocument[] | null>
}