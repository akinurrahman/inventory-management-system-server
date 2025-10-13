

import asyncHandler from "../utils/async-handler";
import { sendResponse } from "../utils";
import * as authServices from "../services/auth.services";
import { getLocationFromIP } from "../services/geo.service";

export const loginApi = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authServices.loginUser(email, password);

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"] || "";
  const location = await getLocationFromIP(ip);

  await authServices.createSession({
    userId: user._id as string,
    accessToken,
    refreshToken,
    ip,
    userAgent,
    location,
  });

  const { password: _, __v, ...safeUser } = user.toObject();

  sendResponse(
    res,
    { accessToken, refreshToken, user: safeUser },
    "Login successful"
  );
});


export const forgotPasswordApi = asyncHandler(async (req, res) => {});

export const resetPasswordApi = asyncHandler(async (req, res) => {});

export const makeStaffApi = asyncHandler(async (req, res) => {});
