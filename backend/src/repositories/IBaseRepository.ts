import { Model, FilterQuery, UpdateQuery } from "mongoose";

export class BaseRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async getAll(filter: FilterQuery<T>): Promise<T[]> {
    return await this.model.find(filter);
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id,{ isDeleted:false });
  }

  async updateOneByFilter(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T> {
    return this.model.findOneAndUpdate(filter, update, { upsert: true, new: true });
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T> {
    return this.model.findByIdAndUpdate(id, update, { upsert: true, new: true });
  }

  async getByFilter(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteByFilter(filter:FilterQuery<T>): Promise<T | null> {
    return await this.model.findOneAndDelete(filter)
  }
}
