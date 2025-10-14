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

export const forgotPasswordRequestOtpSchema = z.object({
  email: z.email("Invalid email address"),
});

export const forgotPasswordVerifyOtpSchema = z.object({
  email: z.email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const forgotPasswordResetPasswordSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "New Password must be at least 8 characters long"),
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
export type ForgotPasswordInput = z.infer<typeof forgotPasswordRequestOtpSchema>;
export type ForgotPasswordOtpVerifyInput = z.infer<typeof forgotPasswordVerifyOtpSchema>;
export type ForgotPasswordResetInput = z.infer<typeof forgotPasswordResetPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type MakeStaffInput = z.infer<typeof makeStaffSchema>;