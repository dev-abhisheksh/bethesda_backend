import mongoose from "mongoose";
import SpecialProject from "./specialProject.model.js";
import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js";

// Helper to find project by ObjectId or slug (auto-creates Manipur if not in DB yet)
const findProject = async (idOrSlug) => {
    let project = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
        project = await SpecialProject.findById(idOrSlug);
    }
    if (!project) {
        project = await SpecialProject.findOne({ slug: String(idOrSlug).toLowerCase() });
    }
    if (!project && String(idOrSlug).toLowerCase() === "manipur") {
        project = await SpecialProject.create({
            title: "Manipur",
            slug: "manipur",
            badge: "Special Relief Project",
            description:
                "Standing alongside vulnerable families and displaced communities in Manipur with critical relief supplies, food assistance, student education support, and rehabilitation care.",
            order: 0,
            photos: [],
        });
    }
    return project;
};

// @desc    Get all special projects
// @route   GET /api/special-projects
const getAllSpecialProjects = asyncHandler(async (req, res) => {
    let projects = await SpecialProject.find({ isVisible: true }).sort({ order: 1 });

    // Ensure Manipur exists if DB has no special projects yet
    if (projects.length === 0) {
        const defaultManipur = await findProject("manipur");
        projects = defaultManipur ? [defaultManipur] : [];
    }

    res.status(200).json({
        success: true,
        count: projects.length,
        projects,
    });
});

// @desc    Create a special project (Admin only)
// @route   POST /api/special-projects
const createSpecialProject = asyncHandler(async (req, res) => {
    const { title, slug, badge, description, order } = req.body;

    if (!title || !slug) {
        throw new ApiError(400, "Title and slug are required");
    }

    const project = await SpecialProject.create({
        title,
        slug,
        badge: badge || "",
        description: description || "",
        order: order || 0,
    });

    res.status(201).json({
        success: true,
        message: "Special project created",
        project,
    });
});

// @desc    Update a special project (Admin only)
// @route   PUT /api/special-projects/:id
const updateSpecialProject = asyncHandler(async (req, res) => {
    const project = await SpecialProject.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
        runValidators: true,
    });

    if (!project) throw new ApiError(404, "Special project not found");

    res.status(200).json({ success: true, project });
});

// @desc    Upload photo to special project (Admin only)
// @route   POST /api/special-projects/:id/photos
const addSpecialProjectPhoto = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "Please select an image file");

    const project = await findProject(req.params.id);
    if (!project) throw new ApiError(404, "Special project not found");

    const result = await uploadToCloudinary(req.file.buffer, "bethesda/special-projects");

    project.photos.push({
        url: result.secure_url,
        publicId: result.public_id,
    });

    await project.save();

    res.status(200).json({
        success: true,
        message: "Photo uploaded successfully",
        photo: { url: result.secure_url, publicId: result.public_id },
        project,
    });
});

// @desc    Delete photo from special project (Admin only)
// @route   DELETE /api/special-projects/:id/photos/:photoId
const deleteSpecialProjectPhoto = asyncHandler(async (req, res) => {
    const { id, photoId } = req.params;

    const project = await findProject(id);
    if (!project) throw new ApiError(404, "Special project not found");

    const photo = project.photos.id(photoId);
    if (!photo) throw new ApiError(404, "Photo not found");

    if (photo.publicId) {
        try {
            await deleteFromCloudinary(photo.publicId);
        } catch (err) {
            console.error("Failed to delete from Cloudinary:", err);
        }
    }

    project.photos.pull({ _id: photoId });
    await project.save();

    res.status(200).json({ success: true, message: "Photo deleted", project });
});

// @desc    Delete a special project (Admin only)
// @route   DELETE /api/special-projects/:id
const deleteSpecialProject = asyncHandler(async (req, res) => {
    const project = await SpecialProject.findByIdAndDelete(req.params.id);
    if (!project) throw new ApiError(404, "Special project not found");

    res.status(200).json({ success: true, message: "Special project deleted" });
});

export {
    getAllSpecialProjects,
    createSpecialProject,
    updateSpecialProject,
    addSpecialProjectPhoto,
    deleteSpecialProjectPhoto,
    deleteSpecialProject,
};
