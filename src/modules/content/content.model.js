import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: [true, "Section key is required"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, "Section data payload is required"],
        },
    },
    { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
