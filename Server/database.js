import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const dbUrl = process.env.ATLASDB_URL;
let localUrl = 'mongodb://localhost:27017/FileIO';
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default connectDB;
