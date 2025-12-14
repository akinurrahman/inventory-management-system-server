import { User } from "../../models/user.mode";
import {
  BadRequestError,
  createPagination,
  getPaginationParams,
} from "../../utils";
import { sendEmail } from "../email.service";
import * as authEmailTemplates from "../../emails/auth.emails";
import { USER_ROLE } from "../../constants/enums";
import { pickBy } from "lodash";
import { MakeUserInput } from "../../validators/user-management.validators";

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

export async function getUserById(id: string) {
  const user = await User.findById(id).lean();
  if (!user) throw new BadRequestError("User not found");
  return {
    data: user,
    message: "User fetched successfully!",
  };
}

export async function deleteUserById(id: string) {
  const user = await User.findByIdAndDelete(id).lean();
  if (!user) throw new BadRequestError("User not found");
  return {
    data: user,
    message: "User deleted successfully!",
  };
}

export async function updateUserById(id: string, body: Partial<MakeUserInput>) {
  const updates = pickBy(body, (value: unknown) => value !== undefined);
  const user = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();
  if (!user) throw new BadRequestError("User not found");
  return {
    data: user,
    message: "User updated successfully!",
  };
}