import ApiError from "../error/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // 1. Convert non-ApiError instances if needed
  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // Handle Mongoose Bad ObjectId (CastError)
    if (error.name === "CastError") {
      statusCode = 400;
      message = `Resource not found. Invalid ${error.path}: ${error.value}`;
    }

    // Handle Mongoose Duplicate Key Error (E11000)
    else if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0] || "field";
      message = `Duplicate value entered for ${field}. Please use another value.`;
    }

    // Handle Mongoose Validation Error
    else if (error.name === "ValidationError") {
      statusCode = 400;
      message = Object.values(error.errors)
        .map((val) => val.message)
        .join(", ");
    }

    // Handle JWT Errors
    else if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token. Please log in again.";
    } else if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token has expired. Please log in again.";
    }

    error = new ApiError(statusCode, message, error.errors || [], error.stack);
  }

  // 2. Hide unhandled internal server error details in production
  const isProduction = process.env.NODE_ENV === "production";
  const statusCode = error.statusCode || 500;
  const message =
    !error.isOperational && isProduction
      ? "Internal Server Error"
      : error.message || "Something went wrong";

  // Log unexpected server errors for debugging
  if (statusCode >= 500) {
    console.error("❌ [SERVER ERROR]:", err);
  }

  // 3. Send structured JSON response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default errorMiddleware;