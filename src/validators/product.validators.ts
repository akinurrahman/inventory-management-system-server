import z from "zod";
import { PRODUCT_CATEGORY } from "../constants/enums";

export const productSchema = z.object({
  name: z.string("Product name is required").min(1, "Product name is required"),
  description: z
    .string("Product description is required")
    .min(1, "Product description is required"),
  stock: z
    .number("Stock must be a positive number")
    .min(0, "Stock must be a positive number"),
  minStock: z
    .number("Minimum stock must be a positive number")
    .min(0, "Minimum stock must be a positive number")
    .optional(),
  category: z.enum(Object.values(PRODUCT_CATEGORY), "Invalid product category"),
  price: z
    .number("Price must be a positive number")
    .min(0, "Price must be a positive number"),
  discount: z
    .number("Discount must be at least 0")
    .min(0, "Discount must be at least 0")
    .max(100, "Discount cannot exceed 100")
    .optional(),
  files: z.array(z.url("Each file must be a valid URL")).optional(),
  status: z.enum(["active", "inactive", "draft"]).optional(),
  tags: z.array(z.string()).optional(),
  supplierIds: z
    .array(z.string())
    .nonempty("At least one supplier is required"),
});



export type ProductInput = z.infer<typeof productSchema>;
