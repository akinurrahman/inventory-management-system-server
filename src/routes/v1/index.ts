import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import supplierRoutes from "./supplier.routes";

const router = Router()

router.use("/auth", authRoutes)
router.use("/products", productRoutes);
router.use("/suppliers", supplierRoutes);


export default router;