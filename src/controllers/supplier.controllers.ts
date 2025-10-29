import { Supplier } from "../models/suppliers.models";
import {
  BadRequestError,
  createPagination,
  getPaginationParams,
  sendResponse,
} from "../utils";
import asyncHandler from "../utils/async-handler";

import { pickBy } from "lodash";

export const createSupplier = asyncHandler(async (req, res) => {
  const newSupplier = await Supplier.create(req.body);

  sendResponse(res, newSupplier, "Supplier created successfully!");
});

export const getAllSuppliers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);

  const [suppliers, total] = await Promise.all([
    Supplier.find().skip(skip).limit(limit).lean(),
    Supplier.countDocuments(),
  ]);

  const pagination = createPagination({
    page,
    limit,
    total,
  });

  sendResponse(
    res,
    suppliers,
    "Suppliers fetched successfully!",
    200,
    pagination
  );
});

export const updateSupplier = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  const updates = pickBy(
    { name, email, phone, address },
    (value: string | undefined) => value !== undefined
  );

  const supplier = await Supplier.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!supplier) {
    throw new BadRequestError("Supplier not found");
  }

  sendResponse(res, supplier, "Supplier updated successfully!");
});

export const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findByIdAndDelete(req.params.id);

  if (!supplier) {
    throw new BadRequestError("Supplier not found");
  }

  sendResponse(res, supplier, "Supplier deleted successfully!");
});
