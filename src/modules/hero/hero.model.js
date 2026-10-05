import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: [true, "Page key is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    photos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    mediaMode: {
      type: String,
      enum: ["carousel", "static"],
      default: "carousel",
    },
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Hero = mongoose.model("Hero", heroSchema);
export default Hero;
