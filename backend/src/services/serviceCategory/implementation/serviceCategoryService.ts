import { inject, injectable } from "inversify";
import { IServiceCategoryService } from "../interface/IServiceCategoryService";
import { ServiceCategoryDocument } from "../../../models/serviceCategory";
import { TYPES } from "../../../DI/types";
import { IServiceCategoryRepository } from "../../../repositories/serviceCategory/interface/IServiceCategoryRepository";

@injectable()
export class ServiceCategoryService implements IServiceCategoryService {
    constructor(
        @inject(TYPES.ServiceCategoryRepository) private _serviceCategoryRepository: IServiceCategoryRepository
    ){}

    async getAllServiceCategories(): Promise<ServiceCategoryDocument[] | null> {
        return await this._serviceCategoryRepository.getAllServiceCategories()
    }
}