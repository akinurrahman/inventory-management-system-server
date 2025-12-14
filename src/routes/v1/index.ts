import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import supplierRoutes from "./supplier.routes";
import processRequest from './process-request.routes'
import fileRoutes from "./file.routes";
import userManagementRoutes from "./user-management.routes";

const router = Router()

router.use("/auth", authRoutes)
router.use("/products", productRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/approval-requests", processRequest );

router.use("/users", userManagementRoutes); 

router.use("/upload", fileRoutes);


export default router;