import { sendResponse } from "../utils";
import asyncHandler from "../utils/async-handler";
import * as productService from "../services/product";

export const createProduct = asyncHandler(async (req, res) => {
  const user = req.user;
  const body = req.body;

  const result = await productService.createProduct(user, body);
  sendResponse(res, result.data, result.message);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const user = req.user;

  const result = await productService.updateProduct(user, body, id);
  sendResponse(res, result.data, result.message);
});

export const getAllProducts = asyncHandler(async (req, res) => {
  const query = req.query as Record<string, string | string[]>;

  const { data, message, pagination } =
    await productService.getAllProducts(query);
  sendResponse(res, data, message, 200, pagination);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await productService.deleteProduct(id);
  sendResponse(res, product.data, product.message);
});

export const getProductUpdateRequests = asyncHandler(async (req, res) => {
  const query = req.query as Record<string, string | string[]>;

  const { data, message, pagination } =
    await productService.getProductApprovalRequests(query);
  sendResponse(res, data, message, 200, pagination);
});

export const approveProductUpdateRequest = asyncHandler(async (req, res) => {});

export const rejectProductUpdateRequest = asyncHandler(async (req, res) => {});
