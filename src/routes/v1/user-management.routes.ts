import { Router } from "express";
import { validateBody } from "../../middlewares/validation.middlewares";
import { makeUserSchema } from "../../validators/user-management.validators";
import * as userControllers from "../../controllers/user-management.controllers";

const router = Router();

router.route("/").post(validateBody(makeUserSchema), userControllers.makeUser);

export default router;
