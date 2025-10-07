import { User } from "../models/user.mode";
import asyncHandler from "../utils/async-handler";

export const registerApi = asyncHandler(async (req, res) => {
  
   const user = await User.findOne({ role: "admin" });
});