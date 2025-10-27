import mongoose from "mongoose";

export interface ISupplier extends mongoose.Document {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required : true},
  email: { type: String },
  address: { type: String },
});

export const Supplier = mongoose.model("Supplier", supplierSchema);
