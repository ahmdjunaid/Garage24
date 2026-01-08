import { inject, injectable } from "inversify";
import { BrandDocument } from "../../../models/brands";
import { IBrandService } from "../interface/IBrandService";
import { TYPES } from "../../../DI/types";
import { IBrandRepository } from "../../../repositories/brand/interface/IBrandRepository";

@injectable()
export class BrandService implements IBrandService {
    constructor(
        @inject(TYPES.BrandRepository) private _brandRepository: IBrandRepository,
    ){}
    async getAllBrands(): Promise<BrandDocument[] | null> {
        return await this._brandRepository.getAllBrands()
    }
}