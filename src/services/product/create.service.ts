import { Product } from "../../models/product.model";
import { ApprovalRequest } from "../../models/approval-request.model";
import { APPROVAL_ACTION } from "../../constants/enums";
import { BadRequestError } from "../../utils";
import { ProductInput } from "../../validators/product.validators";
import { IUser } from "../../models/user.mode";

export const createProduct = async (user: IUser, productData: ProductInput) => {
  if (user.role === "staff") {
    const approval = await ApprovalRequest.create({
      entityType: "Product",
      action: APPROVAL_ACTION.CREATE,
      payload: {
        ...productData,
        createdBy: user._id,
        updatedBy: user._id,
      },
    });

    return {
      data: approval,
      message: "Product creation request sent for approval.",
    };
  }

  if (user.role === "admin") {
    const product = await Product.create({
      ...productData,
      createdBy: user._id,
      updatedBy: user._id,
    });

    return { data: product, message: "Product created successfully." };
  }

  throw new BadRequestError("Invalid user role");
};
