import { User } from "../../models/user.mode";
import { BadRequestError } from "../../utils";
import { sendEmail } from "../email.service";
import * as authEmailTemplates from "../../emails/auth.emails";

export async function requestOtp(email: string) {
  const user = await User.findOne({ email });
  if (!user) throw new BadRequestError("Invalid email address");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await user.hashOtp(otp);

  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}. Valid for 10 minutes.`,
    html: authEmailTemplates.forgotPasswordRequestEmail(user.fullName, otp),
  });
}

export async function verifyOtp(email: string, otp: string) {
  const user = await User.findOne({ email }).select("+otp +otpExpiry");
  if (!user) throw new BadRequestError("Invalid email address");

  if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
    throw new BadRequestError("Otp expired or already used");
  }

  const isValid = await user.compareOtp(otp);
  if (!isValid) throw new BadRequestError("Incorrect otp");

  user.otp = undefined;
  user.otpExpiry = undefined;

  const resetToken = await user.generateResetToken();
  user.resetToken = resetToken;
  await user.save();

  return user;
}

export async function resendOtp(email: string) {
  return requestOtp(email);
}
