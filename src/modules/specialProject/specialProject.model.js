import mongoose from "mongoose";

const specialProjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        badge: {
            type: String,
            default: "",
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        photos: [
            {
                url: { type: String, required: true },
                publicId: { type: String },
            },
        ],
        order: {
            type: Number,
            default: 0,
        },
        isVisible: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const SpecialProject = mongoose.model("SpecialProject", specialProjectSchema);

export default SpecialProject;
