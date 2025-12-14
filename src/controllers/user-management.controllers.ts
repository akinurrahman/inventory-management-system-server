import { createUser } from "../services/auth";
import { sendResponse } from "../utils";
import asyncHandler from "../utils/async-handler";

export const makeUser = asyncHandler(async (req, res) => {
  const { fullName, email, role } = req.body;

  const user = await createUser(fullName, email, role);

  sendResponse(res, user, "User account created successfully");
});
