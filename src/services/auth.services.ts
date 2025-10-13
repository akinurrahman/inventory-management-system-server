import { User } from "../models/user.mode";
import * as authValidation from '../validators/auth.validators'
import { Session } from "../models/session.model";


import * as errors from "../utils";

export async function createAdmin({
  email,
  password,
  fullName,
}: authValidation.RegisterInput) {
  try {
    const user = await User.findOne({ role: "admin" });
    if (user) {
      throw new Error("Admin user already exists");
    }
    const newUser = new User({ email, password, fullName, role: "admin" });
    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
}




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



export const createSession = async ({
  userId,
  accessToken,
  refreshToken,
  ip,
  userAgent,
  location,
}: {
  userId: string;
  accessToken: string;
  refreshToken: string;
  ip?: string;
  userAgent?: string;
  location?: string;
}) => {
  return Session.create({
    userId,
    accessToken,
    refreshToken,
    ip,
    userAgent,
    location,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    isActive: true,
  });
};
