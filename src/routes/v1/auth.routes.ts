import { Router } from "express";
import * as authControllers from '../../controllers/auth.controllers'
import * as authValidation from '../../validators/auth.validators'
import { validateInput } from "../../middlewares/validation.middlewares";

const router = Router()

router.post(
  "/sync-admin",
  validateInput(authValidation.registerSchema),
);

export default router;