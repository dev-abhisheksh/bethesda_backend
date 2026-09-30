import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import ApiError from "./error/apiError.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Core Body Parsers & Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health Check Route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy and running" });
});

// Mount module routes here (e.g. auth, user, content, projects)
// app.use("/api/auth", authRoutes);

// Catch 404 for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// Centralized Global Error Middleware (MUST be registered last)
app.use(errorMiddleware);

export default app;
