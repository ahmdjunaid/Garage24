import { BrandDocument } from "../../../models/brands";

export interface IBrandService {
    getAllBrands(): Promise<BrandDocument[] | null>;
}