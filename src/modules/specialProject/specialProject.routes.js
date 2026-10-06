import { Router } from "express";
import {
    getAllSpecialProjects,
    createSpecialProject,
    updateSpecialProject,
    addSpecialProjectPhoto,
    deleteSpecialProjectPhoto,
    deleteSpecialProject,
} from "./specialProject.controller.js";
import { verifyToken, verifyAdmin } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get("/", getAllSpecialProjects);

// Admin only
router.post("/", verifyToken, verifyAdmin, createSpecialProject);
router.put("/:id", verifyToken, verifyAdmin, updateSpecialProject);
router.delete("/:id", verifyToken, verifyAdmin, deleteSpecialProject);

// Photo upload & delete (Admin only - supports single & multi upload)
router.post("/:id/photos", verifyToken, verifyAdmin, upload.any(), addSpecialProjectPhoto);
router.delete("/:id/photos/:photoId", verifyToken, verifyAdmin, deleteSpecialProjectPhoto);

export default router;
