import { Product } from "../../models/product.model";
import { createPagination, getPaginationParams } from "../../utils";

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
