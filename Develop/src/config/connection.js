import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/SocialDB";

mongoose.connect(MONGODB_URI);

const db = mongoose.connection;

db.on("error", (err) => console.error("❌ MongoDB connection error:", err));
db.once("open", () => console.log("✅ Connected to MongoDB"));

export default db;