import Project from "./project.model.js";
import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";
import { uploadToCloudinary } from "../../config/cloudinary.js";

// @desc    Get all active projects (ordered)
// @route   GET /api/projects
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ isVisible: true }).sort({ order: 1 });

    res.status(200).json({
        success: true,
        count: projects.length,
        projects,
    });
});

// @desc    Get single project by ID
// @route   GET /api/projects/:id
const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) throw new ApiError(404, "Project not found");

    res.status(200).json({
        success: true,
        project,
    });
});

// @desc    Create a new project (Admin only)
// @route   POST /api/projects
const createProject = asyncHandler(async (req, res) => {
    const { title, desc, goal, icon, color, aboutText, photos, order } = req.body;

    if (!title || !desc || !goal) {
        throw new ApiError(400, "Title, description, and goal are required");
    }

    const project = await Project.create({
        title,
        desc,
        goal,
        icon: icon || "🌱",
        color: color || "bl",
        aboutText: aboutText || "",
        photos: photos || [],
        order: order || 0,
    });

    res.status(201).json({
        success: true,
        message: "Project created successfully",
        project,
    });
});

// @desc    Update project details or photos (Admin only)
// @route   PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!project) throw new ApiError(404, "Project not found");

    res.status(200).json({
        success: true,
        message: "Project updated successfully",
        project,
    });
});

// @desc    Delete project (Admin only)
// @route   DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) throw new ApiError(404, "Project not found");

    res.status(200).json({
        success: true,
        message: "Project deleted successfully",
    });
});

// @desc    Upload & add a photo directly to project gallery (Admin only)
// @route   POST /api/projects/:id/photos
const addProjectPhoto = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!req.file) throw new ApiError(400, "Please select an image file to upload");

    const project = await Project.findById(id);
    if (!project) throw new ApiError(404, "Project not found");

    const result = await uploadToCloudinary(req.file.buffer);

    project.photos.push({
        url: result.secure_url,
        publicId: result.public_id,
    });

    await project.save();

    res.status(200).json({
        success: true,
        message: "Photo uploaded and added to project successfully",
        photo: {
            url: result.secure_url,
            publicId: result.public_id,
        },
        project,
    });
});

export {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addProjectPhoto,
};
