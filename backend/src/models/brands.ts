import mongoose, { HydratedDocument, Schema } from "mongoose";

export interface IBrand {
  name: string;
  isBlocked: boolean;
  isDeleted: boolean;
}

const brandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
},{
    timestamps: true
});


export type BrandDocument = HydratedDocument<IBrand>;
export const Brand = mongoose.model<IBrand>("Brand", brandSchema);
