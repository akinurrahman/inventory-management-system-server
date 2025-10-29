import { Router } from "express";

import * as authMiddleware from "../../middlewares/auth.middlewares";
import { validateBody } from "../../middlewares/validation.middlewares";
import * as productValidators from "../../validators/product.validators";
import * as productController from "../../controllers/product.controllers";

const router = Router();

router.use(authMiddleware.requireAuth);

router
  .route("/")
  .post(
    authMiddleware.requireRoles(["admin", "staff"]),
    validateBody(productValidators.productSchema),
    productController.createProduct
  )
  .get(
    authMiddleware.requireRoles(["admin", "staff"]),
    productController.getAllProducts
  );

router
  .route("/:id")
  .patch(
    authMiddleware.requireRoles(["admin", "staff"]),
    validateBody(productValidators.productSchema.partial()),
    productController.updateProduct
  )
  .delete(
    authMiddleware.requireRoles(["admin"]),
    productController.deleteProduct
  );

router
  .route("/requests")
  .get(
    authMiddleware.requireRoles(["admin"]),
    productController.getProductUpdateRequests
  );

router
  .route("/requests/:id")
  .patch(
    authMiddleware.requireRoles(["admin"]),
    validateBody(productValidators.productUpdateRequestRejectSchema),
    productController.rejectProductUpdateRequest
  );

router.patch(
  "/requests/:id/approve",
  authMiddleware.requireRoles(["admin"]),
  productController.approveProductUpdateRequest
);

export default router;
