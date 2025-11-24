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
  .get(
    authMiddleware.requireRoles(["admin", "staff"]),
    productController.getProductById
  )
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



export default router;
