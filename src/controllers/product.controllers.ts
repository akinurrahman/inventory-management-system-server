import { pickBy } from "lodash";
import { Product } from "../models/product.model";
import {
  BadRequestError,
  createPagination,
  getPaginationParams,
  sendResponse,
} from "../utils";
import asyncHandler from "../utils/async-handler";
import { ApprovalRequest } from "../models/approval-request.model";
import { APPROVAL_ACTION } from "../constants/enums";

export const createPrduct = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role === "staff") {
    const productCreateRequest = await ApprovalRequest.create({
      entityType: "Product",
      action: APPROVAL_ACTION.CREATE,
      payload: {
        ...req.body,
        createdBy: user._id,
        updatedBy: user._id,
      },
    });

    return sendResponse(
      res,
      productCreateRequest,
      "Product creation request success! It will be live once admin approves"
    );
  }

  if (user.role === "admin") {
    const newProduct = await Product.create({
      ...req.body,
      createdBy: user._id,
      updatedBy: user._id,
    });

    return sendResponse(res, newProduct, "Product created successfully!");
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const user = req.user;

  const updates = pickBy(
    body,
    (value: string | undefined) => value !== undefined
  );

  if (user.role === "staff") {
    const productUpdateRequest = await ApprovalRequest.create({
      entityType: "Product",
      entityId: id,
      action: APPROVAL_ACTION.UPDATE,
      payload: updates,
      requestedBy: user._id,
    });

    return sendResponse(
      res,
      productUpdateRequest,
      "Product update request created successfully!"
    );
  }

  if (user.role === "admin") {
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      throw new BadRequestError("Product not found");
    }

    return sendResponse(res, product, "Product updated successfully!");
  }
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit).lean(),
    Product.countDocuments(),
  ]);

  const pagination = createPagination({
    page,
    limit,
    total,
  });

  sendResponse(
    res,
    products,
    "Products fetched successfully!",
    200,
    pagination
  );
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new BadRequestError("Product not found");
  }
  sendResponse(res, product, "Product deleted successfully!");
});

export const getProductUpdateRequests = asyncHandler(async (req, res) => {});

export const approveProductUpdateRequest = asyncHandler(async (req, res) => {});

export const rejectProductUpdateRequest = asyncHandler(async (req, res) => {});
