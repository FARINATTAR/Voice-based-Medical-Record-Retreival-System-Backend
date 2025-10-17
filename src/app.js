// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import authRoutes from "./routes/v1/auth.route.js";
// import cors from "cors";

// dotenv.config();
// const app = express();

// app.use(express.json());
// app.use(cors({
//   origin: "http://localhost:5173", // frontend URL
//   credentials: true
// }));
// // Routes
// app.use("/api/v1/auth", authRoutes);

// app.get("/", (req, res) => res.send("Voice Medical Backend Running ✅"));

// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// export default app;
// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import hospitalRoutes from './routes/hospital.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
