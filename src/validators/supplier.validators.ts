import z from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  email: z.email().optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters long").optional(),
});

export type SupplierInput = z.infer<typeof supplierSchema>;