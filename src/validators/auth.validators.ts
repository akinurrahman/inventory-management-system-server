import z from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(8, "Old Password must be at least 8 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});;

export const makeStaffSchema = z.object({
  email: z.email("Invalid email address"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type MakeStaffInput = z.infer<typeof makeStaffSchema>;