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
import heroRoutes from "./modules/hero/hero.routes.js";
import specialProjectRoutes from "./modules/specialProject/specialProject.routes.js";

dotenv.config();

const app = express();

// Trust reverse proxy (Essential for Render and secure cross-origin cookies)
app.set("trust proxy", 1);

// Allowed origins for CORS (Production Vercel + Preview branches + Local dev)
const allowedOrigins = [
  "https://bethesdademo.vercel.app",
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "https://white-baboon-351982.hostingersite.com",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server or tools with no origin
      if (!origin) return callback(null, true);
      // Allow exact matches or any Vercel preview domain (*.vercel.app)
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS error: origin ${origin} is not allowed`));
    },
    credentials: true,
  })
);

// Core Body Parsers & Middlewares (Set to 25mb for CMS content and image payloads)
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// Root & Health Check Routes (For Render health checks and verification)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Bethesda Charitable Trust API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy and running" });
});

// Mount module routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/special-projects", specialProjectRoutes);


// Catch 404 for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});

// Centralized Global Error Middleware (MUST be registered last)
app.use(errorMiddleware);

export default app;
