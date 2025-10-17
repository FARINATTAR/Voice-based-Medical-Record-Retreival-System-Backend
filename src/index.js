import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import hospitalRoutes from "./routes/hospital.js";
import doctorRoutes from "./routes/doctor.js";
import patientRoutes from "./routes/patient.js";

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Mongo connected"))
.catch(err => console.error(err));

// Routes
app.use("/auth", authRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);

// Error handling for duplicate route/middleware crashes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
