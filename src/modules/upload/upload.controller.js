import { uploadToCloudinary } from "../../config/cloudinary.js";
import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";

const uploadImages = asyncHandler(async (req, res) => {
    const files = (req.files && req.files.length > 0) ? req.files : (req.file ? [req.file] : []);
    if (!files.length) throw new ApiError(400, "Please select at least one image file");

    const results = await Promise.allSettled(
        files.map((file) => uploadToCloudinary(file.buffer))
    );

    const successfulUploads = results
        .filter((r) => r.status === "fulfilled" && r.value?.secure_url)
        .map((r) => ({
            url: r.value.secure_url,
            publicId: r.value.public_id,
        }));

    if (successfulUploads.length === 0) {
        const firstError = results.find((r) => r.status === "rejected")?.reason;
        throw new ApiError(500, firstError?.message || "Failed to upload image(s)");
    }

    res.status(200).json({
        success: true,
        message: `${successfulUploads.length} image${successfulUploads.length > 1 ? "s" : ""} uploaded successfully`,
        images: successfulUploads,
        image: successfulUploads[0],
    });
});

export {
    uploadImages
}