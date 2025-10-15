import asyncHandler from "../utils/async-handler";
import { BadRequestError, sendResponse, UnauthorizedError } from "../utils";
import * as authServices from "../services/auth.service";
import { getLocationFromIP } from "../services/geo.service";
import { User } from "../models/user.mode";
import { sendEmail } from "../services/email.service";
import * as authEmailTemplates from "../emails/auth.emails";
import jwt from "jsonwebtoken";
import config from "config";

export const loginApi = asyncHandler(async (req, res) => {
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

export const forgotPasswordRequestApi = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new BadRequestError("Invalid email address");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await user.hashOtp(otp);

  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${user.otp}. It is valid for 10 minutes.`,
    html: authEmailTemplates.forgotPasswordRequestEmail(user.fullName, otp),
  });

  sendResponse(res, undefined, "OTP sent to your email");
});

export const forgotPasswordOtpVerifyApi = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select("+otp +otpExpiry");

  if (!user) throw new BadRequestError("Invalid email address");
  if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now())
    throw new BadRequestError("Otp expired or already used! ");

  const isOtpMatched = await user.compareOtp(otp);

  if (!isOtpMatched) throw new BadRequestError("Incorrect otp");

  user.otp = undefined;
  user.otpExpiry = undefined;

  const resetToken = await user.generateResetToken();
  user.resetToken = resetToken;
  await user.save();

  sendResponse(res, user, "Otp verified succesfully");
});

export const forgotPasswordResetPasswordApi = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;
  const resetTokenSecret = config.get<string>("RESET_TOKEN_SECRET");

  let decoded;
  try {
    decoded = jwt.verify(resetToken, resetTokenSecret) as { userId: string };
  } catch (error) {
    throw new BadRequestError("Invalid or expired reset token");
  }

  const user = await User.findById(decoded.userId).select("+resetToken");
  if(!user || !user.isActive){
    throw new UnauthorizedError("Your account has been blocked! you can't change password.")
  }

  if(user.resetToken !== resetToken){
    throw new BadRequestError("Invalid or expired reset token");
  }

  user.password = password;
  user.resetToken = undefined;
  await user.save();

  sendResponse(res, user, "Password reset successful");

});

export const forgotPasswordResendOtpApi = asyncHandler(async (req, res) => {
  const {email} = req.body;

  const user = await User.findOne({email})

  if(!user) throw new BadRequestError("Invalid email address")

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await user.hashOtp(otp);

      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${user.otp}. It is valid for 10 minutes.`,
        html: authEmailTemplates.forgotPasswordRequestEmail(user.fullName, otp),
      });

      sendResponse(res , undefined, "OTP resend succesfully!")
  
  
})

export const resetPasswordApi = asyncHandler(async (req, res) => {});

export const makeStaffApi = asyncHandler(async (req, res) => {});
