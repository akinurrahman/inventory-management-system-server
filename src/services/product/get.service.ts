import { Product } from "../../models/product.model";
import {
  createPagination,
  getPaginationParams,
  NotFoundError,
} from "../../utils";

export const getAllProducts = async (
  query: Record<string, string | string[]>
) => {
  const { page, limit, skip } = getPaginationParams(query);

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ]);

  const pagination = createPagination({
    page,
    limit,
    total,
  });

  return {
    data: products,
    pagination,
    message: "Products fetched successfully!",
  };
};

export const getProductById = async (id: string) => {
  const product = await Product.findById(id).populate("supplierIds").lean();

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  const { supplierIds, ...rest } = product;

  const transformed = {
    ...rest,
    suppliers: supplierIds,
  };

  return {
    data: transformed,
    message: "Product fetched successfully!",
  };
};
