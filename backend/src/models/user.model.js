import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
        // unique: true // Uncomment if needed
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true }); // Correct placement of timestamps

export const User = mongoose.model("User", userSchema);
