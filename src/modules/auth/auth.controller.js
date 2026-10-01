import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";
import User from "../user/user.model.js";
import jwt from "jsonwebtoken";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET , {
        expiresIn: "7d"
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) throw new ApiError(400, "User already exists. Please login");

    const newUser = await User.create({
        username,
        email,
        password
    });

    const accessToken = generateToken(newUser._id);

    res.cookie("accessToken", accessToken, cookieOptions).status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role
        },
        accessToken
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "All fields are required");

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(400, "User does not exist. Please register");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new ApiError(400, "Invalid credentials");

    const accessToken = generateToken(user._id);

    res.cookie("accessToken", accessToken, cookieOptions).status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        accessToken
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

export { registerUser, loginUser, logoutUser };