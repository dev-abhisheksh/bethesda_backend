import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Project title is required"],
            trim: true,
        },
        icon: {
            type: String,
            default: "🌱",
        },
        color: {
            type: String,
            default: "bl",
        },
        desc: {
            type: String,
            required: [true, "Short description is required"],
            trim: true,
        },
        goal: {
            type: String,
            required: [true, "Project goal is required"],
            trim: true,
        },
        aboutText: {
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

const Project = mongoose.model("Project", projectSchema);

export default Project;
