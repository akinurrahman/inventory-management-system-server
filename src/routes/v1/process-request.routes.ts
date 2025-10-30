import { Router } from "express";
import { processRequest } from "../../controllers/process-request.controllers";
import { validateBody } from "../../middlewares/validation.middlewares";
import { approvalSchema } from "../../validators/approval.validators";
import * as authMiddlewares from "../../middlewares/auth.middlewares";

const router = Router();

router.use(authMiddlewares.requireAuth);
router.use(authMiddlewares.requireRoles(["admin"]));

router.route("/:id/action").post(validateBody(approvalSchema), processRequest);

export default router;
