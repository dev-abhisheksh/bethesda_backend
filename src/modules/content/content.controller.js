import Content from "./content.model.js";
import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";

// @desc    Get all custom website sections
// @route   GET /api/content
const getAllContent = asyncHandler(async (req, res) => {
    const contents = await Content.find();

    // Map array into a clean key-value object: { home: {...}, about: {...} }
    const formattedContent = {};
    contents.forEach((item) => {
        formattedContent[item.key] = item.data;
    });

    res.status(200).json({
        success: true,
        content: formattedContent,
    });
});

// @desc    Get content for a specific section
// @route   GET /api/content/:key
const getContentByKey = asyncHandler(async (req, res) => {
    const { key } = req.params;

    const content = await Content.findOne({ key: key.toLowerCase() });
    if (!content) throw new ApiError(404, `Content for section '${key}' not found`);

    res.status(200).json({
        success: true,
        key: content.key,
        data: content.data,
    });
});

// @desc    Update or create (upsert) section content (Admin only)
// @route   PUT /api/content/:key
const updateContentByKey = asyncHandler(async (req, res) => {
    const { key } = req.params;
    const { data } = req.body;

    if (!data) throw new ApiError(400, "Section data payload is required");

    // Upsert: updates if exists, creates if it doesn't
    const updatedContent = await Content.findOneAndUpdate(
        { key: key.toLowerCase() },
        { key: key.toLowerCase(), data },
        { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        message: `Content for section '${key}' updated successfully`,
        content: updatedContent,
    });
});

// @desc    Delete section custom content (Admin only - resets to default)
// @route   DELETE /api/content/:key
const deleteContentByKey = asyncHandler(async (req, res) => {
    const { key } = req.params;

    const deleted = await Content.findOneAndDelete({ key: key.toLowerCase() });
    if (!deleted) throw new ApiError(404, `Content for section '${key}' not found`);

    res.status(200).json({
        success: true,
        message: `Content for section '${key}' removed successfully`,
    });
});

export {
    getAllContent,
    getContentByKey,
    updateContentByKey,
    deleteContentByKey,
};
