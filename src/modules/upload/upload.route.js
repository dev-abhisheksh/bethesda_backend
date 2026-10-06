import express from "express";
import verifyToken, { verifyAdmin } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/multer.middleware.js";
import { uploadImages } from "./upload.controller.js";

const router = express.Router();

router.use(verifyToken)
router.use(verifyAdmin);

router.post("/", upload.any(), uploadImages);

export default router;