import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import ApiError from "./error/apiError.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import uploadRoutes from "./modules/upload/upload.route.js"
import projectRoutes from "./modules/project/project.routes.js";
import contentRoutes from "./modules/content/content.routes.js";

dotenv.config();

const app = express();

// Cross-Origin Resource Sharing (CORS) with cookies enabled
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Core Body Parsers & Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy and running" });
});

// Mount module routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/content", contentRoutes);

// Catch 404 for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// Centralized Global Error Middleware (MUST be registered last)
app.use(errorMiddleware);

export default app;
