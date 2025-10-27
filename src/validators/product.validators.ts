import z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  stock: z.number().min(0, "Stock must be a positive number"),
  minStock: z
    .number()
    .min(0, "Minimum stock must be a positive number")
    .optional(),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be a positive number"),
  discount: z
    .number()
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

export const productUpdateRequestRejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateRequestRejectInput = z.infer<
  typeof productUpdateRequestRejectSchema
>;