import { User } from "../../models/user.mode";
import * as errors from "../../utils";

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new errors.UnauthorizedError("Invalid credentials");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid)
    throw new errors.UnauthorizedError("Invalid credentials");

  if (!user.isActive)
    throw new errors.ForbiddenError(
      "Your account has been deactivated. Please contact admin."
    );

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.lastLogin = new Date();
  await user.save();

  return { user, accessToken, refreshToken };
};