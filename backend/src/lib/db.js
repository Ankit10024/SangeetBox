import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during connection, log it
        console.log("Failed to connect to MongoDB", error);
        process.exit(1); // Exit the process with a failure code
    }
};
