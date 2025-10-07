import { User } from "../models/user.mode";
import * as authValidation from '../validators/auth.validators'

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
