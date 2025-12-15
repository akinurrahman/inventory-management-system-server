import { Router } from "express";
import { validateBody } from "../../middlewares/validation.middlewares";
import { makeUserSchema } from "../../validators/user-management.validators";
import * as userControllers from "../../controllers/user-management.controllers";
import * as authMiddleware from "../../middlewares/auth.middlewares";

const router = Router();


router.use(authMiddleware.requireAuth);
router.use(authMiddleware.requireRoles(["admin"]));

router
  .route("/")
  .post(validateBody(makeUserSchema), userControllers.makeUser)
  .get(userControllers.getAllUsers);

router
  .route("/:id")
  .get(userControllers.getUserById)
  .patch(validateBody(makeUserSchema.partial()), userControllers.updateUserById)
  .delete(userControllers.deleteUserById);

router
  .route("/:id/block")
  .patch(userControllers.blockUserById);

router
  .route("/:id/unblock")
  .patch(userControllers.unblockUserById);

export default router;
