import * as userService from "../services/auth";
import { sendResponse } from "../utils";
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
