import { Model, FilterQuery, UpdateQuery, HydratedDocument } from "mongoose";

export class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return await this.model.create(data);
  }

  async getAll(filter: FilterQuery<T>): Promise<HydratedDocument<T>[]> {
    return await this.model.find(filter);
  }

  async getById(id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findById(id, { isDeleted: false });
  }

  async updateOneByFilter(
    filter: FilterQuery<T>,
    update: UpdateQuery<HydratedDocument<T>>
  ): Promise<HydratedDocument<T> | null> {
    return await this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async updateById(
    id: string,
    update: UpdateQuery<HydratedDocument<T>>
  ): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(id, update, { new: true });
  }

  async getByFilter(
    filter: FilterQuery<T>
  ): Promise<HydratedDocument<T> | null> {
    return await this.model.findOne(filter);
  }

  async deleteById(id: string): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async deleteByFilter(
    filter: FilterQuery<T>
  ): Promise<HydratedDocument<T> | null> {
    return await this.model.findByIdAndUpdate(filter, { isDeleted: true }, { new: true });
  }
}
