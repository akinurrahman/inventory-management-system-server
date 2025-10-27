import mongoose from "mongoose";

export interface IProductUpdateRequest extends mongoose.Document {
  productId: mongoose.Schema.Types.ObjectId;
  updatedFields: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productUpdateRequestSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    updatedFields: { type: Object, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export const ProductUpdateRequest = mongoose.model<IProductUpdateRequest>(
  "ProductUpdateRequest",
  productUpdateRequestSchema
);