import { Router } from "express";
import * as authMiddleware from "../../middlewares/auth.middlewares";
import * as supplierController from "../../controllers/supplier.controllers";
import { validateBody } from "../../middlewares/validation.middlewares";
import * as supplierValidators from "../../validators/supplier.validators";

const router = Router();

router.use(authMiddleware.requireAuth);


router 
    .route("/")
    .post(
        authMiddleware.requireRoles(["admin", "staff"]),
        validateBody(supplierValidators.supplierSchema),
        supplierController.createSupplier
    )
    .get(
        authMiddleware.requireRoles(["admin", "staff"]),
        supplierController.getAllSuppliers
    );

router
    .route("/:id")
    .patch(
        authMiddleware.requireRoles(["admin", "staff"]),
        validateBody(supplierValidators.supplierSchema),
        supplierController.updateSupplier
    )
    .delete(
        authMiddleware.requireRoles(["admin"]),
        supplierController.deleteSupplier
    );

export default router;
