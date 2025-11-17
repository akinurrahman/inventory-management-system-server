import { Router } from "express";
import * as authValidation from "../../validators/auth.validators";
import { validateBody } from "../../middlewares/validation.middlewares";
import * as authController from "../../controllers/auth.controllers";
import * as authMiddleware from "../../middlewares/auth.middlewares";

const router = Router();

router
  .post(
    "/login",
    validateBody(authValidation.loginSchema),
    authController.login
  )
  .post(
    "/forgot-password/request-otp",
    validateBody(authValidation.forgotPasswordRequestOtpSchema),
    authController.forgotPasswordRequest
  )
  .post(
    "/forgot-password/verify-otp",
    validateBody(authValidation.forgotPasswordVerifyOtpSchema),
    authController.forgotPasswordOtpVerify
  )
  .post(
    "/forgot-password/resend-otp",
    validateBody(authValidation.forgotPasswordResendOtpSchema),
    authController.forgotPasswordResendOtp
  )
  .post(
    "/forgot-password/reset-password",
    validateBody(authValidation.forgotPasswordResetPasswordSchema),
    authController.forgotPasswordResetPassword
  );

router.use(authMiddleware.requireAuth);

router.post(
  "/refresh-token",
  validateBody(authValidation.logoutSchema),
  authController.refreshToken
);
router.post("/logout", validateBody(authValidation.logoutSchema), authController.logout);

router.use(authMiddleware.requireRoles(["admin"]));
router
  .post(
    "/reset-password",
    validateBody(authValidation.resetPasswordSchema),
    authController.resetPassword
  )
  .post(
    "/make-staff",
    validateBody(authValidation.makeStaffSchema),
    authController.makeStaff
  );

export default router;
