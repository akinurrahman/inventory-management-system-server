import { User } from "../../models/user.mode";
import { BadRequestError } from "../../utils";
import { sendEmail } from "../email.service";
import * as authEmailTemplates from "../../emails/auth.emails";

export async function createStaff(fullName: string, email: string) {
  const existing = await User.findOne({ email });
  if (existing) throw new BadRequestError("Staff already exists");

  const password = Math.random().toString(36).slice(-8);

  const user = await User.create({
    fullName,
    email,
    password,
    role: "staff",
    isActive: true,
  });

  await sendEmail({
    to: email,
    subject: "Staff Account Created",
    html: authEmailTemplates.makeStaffEmail(fullName, email, password),
  });

  return user;
}
