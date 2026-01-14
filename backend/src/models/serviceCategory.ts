import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface IServiceCategory {
  name: string;
  description: string;
  isDeleted: boolean;
  isBlocked: boolean;
}

export const serviceCategorySchema = new Schema<IServiceCategory>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
},{
    timestamps: true
});


export type ServiceCategoryDocument = HydratedDocument<IServiceCategory>;
export const ServiceCategory = mongoose.model<IServiceCategory>("ServiceCatgory", serviceCategorySchema);