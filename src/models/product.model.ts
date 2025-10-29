import { format } from "date-fns";
import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
  sku: string;
  name: string;
  description: string;
  stock: number;
  minStock: number;
  category: string;
  price: number;
  discount: number;
  files?: string[];
  status: "active" | "inactive" | "draft";
  tags?: string[];
  createdBy: mongoose.Schema.Types.ObjectId;
  updatedBy: mongoose.Schema.Types.ObjectId;
  supplierIds: mongoose.Schema.Types.ObjectId[];
}

const productSchema = new mongoose.Schema<IProduct>(
  {
    sku: { type: String, unique: true, immutable: true },
    name: {
      type: String,
      required: true,
      unique: [true, "Product name must be unique"],
    },
    description: { type: String },
    stock: { type: Number, required: true },
    minStock: { type: Number, default: 0, min: 0 }, // to send low stock alerts
    category: { type: String },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    files: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    tags: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    supplierIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supplier",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre<IProduct>("save", function (next) {
  if (this.sku) return next();

  try {
    const datePart = format(new Date(), "yyyyMMdd");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

    const prefix = this.category
      ? this.category.slice(0, 4).toUpperCase()
      : "PROD";
    const newSku = `${prefix}-${datePart}-${randomPart}`;
    this.sku = newSku;
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
