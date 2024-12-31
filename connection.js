import mongoose from "mongoose";

async function connectDB(url) {
    await mongoose.connect(url)
}

export { connectDB }