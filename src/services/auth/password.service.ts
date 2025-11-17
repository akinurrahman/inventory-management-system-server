import jwt from "jsonwebtoken";
import config from "config";
import { User } from "../../models/user.mode";
import { BadRequestError, UnauthorizedError } from "../../utils";

export async function resetPassword(resetToken: string, password: string) {
  const secret = config.get<string>("RESET_TOKEN_SECRET");

  let decoded;
  try {
    decoded = jwt.verify(resetToken, secret) as { userId: string };
  } catch {
    throw new BadRequestError("Invalid or expired reset token");
  }

  const user = await User.findById(decoded.userId).select("+resetToken");
  if (!user || !user.isActive) {
    throw new UnauthorizedError("Your account is inactive");
  }

  if (user.resetToken !== resetToken) {
    throw new BadRequestError("Invalid or expired reset token");
  }

  user.password = password;
  user.resetToken = undefined;
  await user.save();

  return user;
}
