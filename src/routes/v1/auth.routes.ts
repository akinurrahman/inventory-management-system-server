import { Router } from "express";
import * as authValidation from '../../validators/auth.validators'
import { validateBody } from "../../middlewares/validation.middlewares";
import * as authController from '../../controllers/auth.controllers'


const router = Router()

router
.post('/login', validateBody(authValidation.loginSchema), authController.loginApi)
.post('/forgot-password', validateBody(authValidation.forgotPasswordSchema), authController.forgotPasswordApi)
.post('/reset-password', validateBody(authValidation.resetPasswordSchema), authController.resetPasswordApi)
.post('/make-staff', validateBody(authValidation.makeStaffSchema), authController.makeStaffApi)

export default router;