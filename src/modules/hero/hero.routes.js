import { Router } from "express";
import {
  getHero,
  updateHero,
  uploadHeroPhoto,
  deleteHeroPhoto,
} from "./hero.controller.js";
import upload from "../../middlewares/multer.middleware.js";
import { verifyToken, verifyAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public route: fetch hero photos and mode for any page
router.get("/:page", getHero);

// Admin-only management routes
router.put("/:page", verifyToken, verifyAdmin, updateHero);
router.post(
  "/:page/photos",
  verifyToken,
  verifyAdmin,
  upload.any(),
  uploadHeroPhoto
);
router.delete(
  "/:page/photos/:photoId",
  verifyToken,
  verifyAdmin,
  deleteHeroPhoto
);

export default router;
