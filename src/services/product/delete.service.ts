import { Product } from "../../models/product.model";
import { BadRequestError } from "../../utils";

export const deleteProduct = async (id: string) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new BadRequestError("Product not found");
  }

  return { data: product, message: "Product deleted successfully!" };
};
