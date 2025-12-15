import * as userService from "../services/auth";
import { BadRequestError, sendResponse } from "../utils";
import asyncHandler from "../utils/async-handler";

export const makeUser = asyncHandler(async (req, res) => {
  const { fullName, email, role } = req.body;

  const user = await userService.createUser(fullName, email, role);

  sendResponse(res, user, "User account created successfully");
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const query = req.query as Record<string, string | string[]>;
  const result = await userService.getUsers(query);
  sendResponse(res, result.data, result.message, 200, result.pagination);
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  sendResponse(res, user.data, user.message);
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userService.deleteUserById(id);
  sendResponse(res, user.data, user.message);
});

export const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const user = await userService.updateUserById(id, body);
  sendResponse(res, user.data, user.message);
});

export const blockUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("User ID is required");
  }
  const user = await userService.blockUserById(id);
  sendResponse(res, user.data, user.message);
});

export const unblockUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("User ID is required");
  }
  const user = await userService.unblockUserById(id);
  sendResponse(res, user.data, user.message);
});
