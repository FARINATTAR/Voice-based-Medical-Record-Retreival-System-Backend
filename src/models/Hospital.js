// src/models/Hospital.js
import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, trim: true },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],   // users with role 'doctor'
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // users with role 'patient'
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Hospital', hospitalSchema);
