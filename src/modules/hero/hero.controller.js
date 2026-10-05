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

// @desc    Upload a new photo to a page's hero carousel (Admin)
// @route   POST /api/hero/:page/photos
export const uploadHeroPhoto = asyncHandler(async (req, res) => {
  const page = req.params.page.toLowerCase();

  if (!req.file) {
    throw new ApiError(400, "Image file is required");
  }

  const uploadResult = await uploadToCloudinary(req.file.buffer, "bethesda/hero");

  let hero = await Hero.findOne({ page });
  if (!hero) {
    hero = new Hero({ page, photos: [] });
  }

  hero.photos.push({
    url: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  });

  await hero.save();

  res.status(200).json({
    success: true,
    message: "Photo uploaded to hero carousel",
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
