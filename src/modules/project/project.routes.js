import { Router } from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addProjectPhoto,
} from "./project.controller.js";
import { verifyToken, verifyAdmin } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/multer.middleware.js";

const router = Router();

// Public routes (anyone visiting the website can view)
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Admin-only routes (protected)
router.post("/", verifyToken, verifyAdmin, createProject);
router.put("/:id", verifyToken, verifyAdmin, updateProject);
router.delete("/:id", verifyToken, verifyAdmin, deleteProject);

// 1-Step Direct Photo Upload to project gallery
router.post("/:id/photos", verifyToken, verifyAdmin, upload.single("image"), addProjectPhoto);

export default router;
