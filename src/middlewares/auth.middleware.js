import jwt from "jsonwebtoken";
import User from "../modules/user/user.model.js";
import ApiError from "../error/apiError.js";
import asyncHandler from "../error/asyncHandler.js";

const verifyToken = asyncHandler(async (req, res, next) => {
    let token = req.cookies?.accessToken || req.cookies?.token;

    if (!token && req.headers.authorization) {
        token = req.headers.authorization.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : req.headers.authorization;
    }

    if (!token) {
        throw new ApiError(401, "No token provided. Please log in");
    }


    let decoded;
    try {
        decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default_jwt_secret"
        );
    } catch (error) {
        throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
        throw new ApiError(401, "User not found or account deactivated");
    }

    req.user = user;
    next();
});

const verifyAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "Access denied. Admin privileges required");
    }
    next();
};

export default verifyToken;
export { verifyToken, verifyAdmin };