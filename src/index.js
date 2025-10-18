import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoutes from './routes/auth.js';
import hospitalRoutes from './routes/hospital.js';
import doctorRoutes from './routes/doctor.js';
import patientRoutes from './routes/patient.js';
import recordsRoutes from './routes/records.js';

dotenv.config();
const app = express();

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parsers
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // stop server if DB cannot connect
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/records', recordsRoutes);

// Test route
app.get('/', (req, res) => res.send('Server is running!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
