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
    supplierId: mongoose.Schema.Types.ObjectId;
}

export interface ISupplier {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
}

const supplierSchema = new mongoose.Schema<ISupplier>({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    address : { type: String },
});

const productSchema = new mongoose.Schema<IProduct>({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    stock: { type: Number, required: true},
    minStock: { type: Number, default: 0, min: 0 },
    category: { type: String },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    files: [{ type: String }],
    status: { type: String, enum: ["active", "inactive", "draft"], default: "draft" },
    tags : [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    supplierId: { type: supplierSchema, required: false },
}, { timestamps: true });

export const Product = mongoose.model<IProduct>("Product", productSchema);