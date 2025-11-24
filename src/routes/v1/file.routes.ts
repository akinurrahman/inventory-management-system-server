import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middlewares";
import { upload } from "../../middlewares/upload.middleware";
import { uploadFiles } from "../../controllers/file.controllers";

const router = Router();

router.route("/files").post(requireAuth, upload.array("files", 8), uploadFiles);
export default router;
