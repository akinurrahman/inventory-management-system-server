import { pickBy } from "lodash";
import { APPROVAL_ACTION } from "../../constants/enums";
import { IUser } from "../../models/user.mode";
import { ApprovalRequest } from "../../models/approval-request.model";
import { Product } from "../../models/product.model";
import { BadRequestError } from "../../utils";
import { ProductInput } from "../../validators/product.validators";

export const updateProduct = async (
  user: IUser,
  body: Partial<ProductInput>,
  id: string
) => {
  const updates = pickBy(body, (value: unknown) => value !== undefined);

  if (user.role === "staff") {
    const productUpdateRequest = await ApprovalRequest.create({
      entityType: "Product",
      entityId: id,
      action: APPROVAL_ACTION.UPDATE,
      payload: updates,
      requestedBy: user._id,
    });

    return {
      data: productUpdateRequest,
      message: "Product update request created successfully!",
    };
  }

  if (user.role === "admin") {
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    return { data: product, message: "Product updated successfully!" };
  }
  throw new BadRequestError("Invalid user role");
};
