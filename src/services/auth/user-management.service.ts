import { User } from "../../models/user.mode";
import {
  BadRequestError,
  createPagination,
  getPaginationParams,
} from "../../utils";
import { sendEmail } from "../email.service";
import * as authEmailTemplates from "../../emails/auth.emails";
import { USER_ROLE } from "../../constants/enums";

export async function createUser(
  fullName: string,
  email: string,
  role: USER_ROLE
) {
  const existing = await User.findOne({ email });
  if (existing) throw new BadRequestError("User already exists");

  const password = Math.random().toString(36).slice(-8);

  const user = await User.create({
    fullName,
    email,
    password,
    role,
    isActive: true,
  });

  await sendEmail({
    to: email,
    subject: "Welcome to the System",
    html: authEmailTemplates.makeUserWelcomeEmail(
      fullName,
      email,
      password,
      role
    ),
  });

  return user;
}

export async function getUsers(query: Record<string, string | string[]>) {
  const { page, limit, skip } = getPaginationParams(query);

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);

  const pagination = createPagination({
    page,
    limit,
    total,
  });

  return {
    data: users,
    pagination,
    message: "Users fetched successfully!",
  };
}
