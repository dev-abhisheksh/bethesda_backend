import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload buffer directly to "bethesda" folder in Cloudinary with auto format/compression
export const uploadToCloudinary = (fileBuffer, folder = "bethesda") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error) return reject(error);
                if (result && result.secure_url) {
                    // Inject Cloudinary dynamic auto format (WebP/AVIF) and quality compression
                    result.secure_url = result.secure_url.replace(
                        "/upload/",
                        "/upload/f_auto,q_auto/"
                    );
                }
                resolve(result);
            }
        );
        stream.end(fileBuffer);
    });
};

// Delete image from Cloudinary by public ID
export const deleteFromCloudinary = async (publicId) => {
    if (!publicId) return;
    return await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;