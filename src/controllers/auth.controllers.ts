import asyncHandler from "../utils/async-handler";
import { BadRequestError, sendResponse } from "../utils";
import { getLocationFromIP } from "../services/geo.service";
import * as authServices from "../services/auth";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken, refreshToken } = await authServices.loginUser(
    email,
    password
  );

  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "";
  const userAgent = req.headers["user-agent"] || "";
  const location = await getLocationFromIP(ip);

  await authServices.createSession({
    userId: user._id as string,
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

export const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authServices.requestOtp(email);

  sendResponse(res, undefined, "OTP sent to your email");
});

export const forgotPasswordOtpVerify = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await authServices.verifyOtp(email, otp);
  sendResponse(res, user, "Otp verified succesfully");
});

export const forgotPasswordResetPassword = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;
  const user = await authServices.resetPassword(resetToken, password);

  sendResponse(res, user, "Password reset successful");
});

export const forgotPasswordResendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authServices.resendOtp(email);

  sendResponse(res, undefined, "OTP resend succesfully!");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user)
    throw new BadRequestError("You must be logged in to reset your password");

  // get the curr and new password
  // decode the curr pass if fail throw error else procced
  // save the new password to db
  // invalidate all curr active sessions
  // send email to the user
  // return success message
});



export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const { newAccessToken, newRefreshToken } =
    await authServices.rotateRefreshToken(refreshToken);

  sendResponse(
    res,
    { accessToken: newAccessToken, refreshToken: newRefreshToken },
    "Token refreshed successfully"
  );
});

export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authServices.logout(refreshToken);

  sendResponse(res, undefined, "Logged out successfully");
});
