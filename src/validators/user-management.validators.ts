import z from "zod";
import { USER_ROLE } from "../constants/enums";

export const makeUserSchema = z.object({
  email: z.email("Invalid email address"),
  fullName: z.string("Name is required"),
  role: z.enum(USER_ROLE).refine((role) => role !== USER_ROLE.ADMIN, {
    message: "Admin users cannot be created via API",
  }),
});

export type MakeUserInput = z.infer<typeof makeUserSchema>;
