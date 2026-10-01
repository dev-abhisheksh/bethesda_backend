import { Router } from "express";
import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from "./project.controller.js";
import { verifyToken, verifyAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes (anyone visiting the website can view)
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// Admin-only routes (protected)
router.post("/", verifyToken, verifyAdmin, createProject);
router.put("/:id", verifyToken, verifyAdmin, updateProject);
router.delete("/:id", verifyToken, verifyAdmin, deleteProject);

export default router;
