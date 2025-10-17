import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/v1/auth.route.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));
// Routes
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => res.send("Voice Medical Backend Running ✅"));

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;
