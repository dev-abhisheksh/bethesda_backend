import { uploadToCloudinary } from "../../config/cloudinary.js";
import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";

const uploadImages = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, "Image file not provided")

    const result = await uploadToCloudinary(req.file.buffer);

    res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        image: {
            url: result.secure_url,
            publicId: result.public_id
        }
    })
})

export {
    uploadImages
}