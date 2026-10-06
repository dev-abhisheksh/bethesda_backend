import Hero from "./hero.model.js";
import ApiError from "../../error/apiError.js";
import asyncHandler from "../../error/asyncHandler.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../config/cloudinary.js";

// @desc    Get hero settings & photos for a page
// @route   GET /api/hero/:page
export const getHero = asyncHandler(async (req, res) => {
  const page = req.params.page.toLowerCase();
  const hero = await Hero.findOne({ page });

  res.status(200).json({
    success: true,
    hero: hero || {
      page,
      photos: [],
      mediaMode: "carousel",
      activeIndex: 0,
    },
  });
});

// @desc    Update hero mode or active index (Admin)
// @route   PUT /api/hero/:page
export const updateHero = asyncHandler(async (req, res) => {
  const page = req.params.page.toLowerCase();

  const hero = await Hero.findOneAndUpdate(
    { page },
    { $set: req.body },
    { upsert: true, returnDocument: "after", runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Hero settings updated successfully",
    hero,
  });
});

// @desc    Upload photo(s) to a page's hero carousel (Admin, supports multi-upload)
// @route   POST /api/hero/:page/photos
export const uploadHeroPhoto = asyncHandler(async (req, res) => {
  const page = req.params.page.toLowerCase();
  const files = (req.files && req.files.length > 0) ? req.files : (req.file ? [req.file] : []);

  if (!files.length) {
    throw new ApiError(400, "Please select at least one image file");
  }

  const results = await Promise.allSettled(
    files.map((file) => uploadToCloudinary(file.buffer, "bethesda/hero"))
  );

  const successfulUploads = results
    .filter((r) => r.status === "fulfilled" && r.value?.secure_url)
    .map((r) => ({
      url: r.value.secure_url,
      publicId: r.value.public_id,
    }));

  if (successfulUploads.length === 0) {
    const firstError = results.find((r) => r.status === "rejected")?.reason;
    throw new ApiError(500, firstError?.message || "Failed to upload images");
  }

  let hero = await Hero.findOne({ page });
  if (!hero) {
    hero = new Hero({ page, photos: [] });
  }

  hero.photos.push(...successfulUploads);
  await hero.save();

  res.status(200).json({
    success: true,
    message: `${successfulUploads.length} photo${successfulUploads.length > 1 ? "s" : ""} uploaded to hero carousel`,
    photos: successfulUploads,
    photo: successfulUploads[0],
    hero,
  });
});

// @desc    Delete a photo from a page's hero carousel (Admin)
// @route   DELETE /api/hero/:page/photos/:photoId
export const deleteHeroPhoto = asyncHandler(async (req, res) => {
  const { page, photoId } = req.params;
  const hero = await Hero.findOne({ page: page.toLowerCase() });

  if (!hero) {
    throw new ApiError(404, "Hero section not found");
  }

  // Find photo by _id, publicId, or url
  const targetIndex = hero.photos.findIndex(
    (p) => String(p._id) === photoId || p.publicId === photoId || p.url === photoId
  );

  if (targetIndex === -1) {
    throw new ApiError(404, "Photo not found in hero carousel");
  }

  const [removedPhoto] = hero.photos.splice(targetIndex, 1);

  if (removedPhoto?.publicId) {
    try {
      await deleteFromCloudinary(removedPhoto.publicId);
    } catch (err) {
      console.warn("Cloudinary photo delete warning:", err.message);
    }
  }

  if (hero.activeIndex >= hero.photos.length) {
    hero.activeIndex = Math.max(0, hero.photos.length - 1);
  }

  await hero.save();

  res.status(200).json({
    success: true,
    message: "Photo removed from hero carousel",
    hero,
  });
});
