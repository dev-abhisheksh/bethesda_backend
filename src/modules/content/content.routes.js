import { Router } from "express";
import {
    getAllContent,
    getContentByKey,
    updateContentByKey,
    deleteContentByKey,
} from "./content.controller.js";
import { verifyToken, verifyAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes (the website reads these to display content)
router.get("/", getAllContent);
router.get("/:key", getContentByKey);

// Admin-only routes (triggered when admin clicks Edit on a section)
router.put("/:key", verifyToken, verifyAdmin, updateContentByKey);
router.delete("/:key", verifyToken, verifyAdmin, deleteContentByKey);

export default router;
