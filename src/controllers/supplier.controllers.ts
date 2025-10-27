import { Supplier } from "../models/suppliers.models";
import { BadRequestError, sendResponse } from "../utils";
import asyncHandler from "../utils/async-handler";

export const createSupplier = asyncHandler(async (req, res) => {
  const { name, email, phone, address } = req.body;

  const supplier = await Supplier.findOne({
    $or: [{ phone }, ...(email ? [{ email }] : [])],
  });

  if (supplier) {
    throw new BadRequestError(
      "Supplier with given phone or email already exists"
    );
  }

  const newSupplier = await Supplier.create({
    name,
    email,
    phone,
    address,
  });

  sendResponse(res, newSupplier, "Supplier created successfully!")
});

export const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find()

    if(suppliers.length < 1){
        return sendResponse(res, [], "No supplier found")
    }

    sendResponse(res, suppliers, "All suppliers fetched successfully")
});

export const updateSupplier = asyncHandler(async (req, res) => {});

export const deleteSupplier = asyncHandler(async (req, res) => {});
