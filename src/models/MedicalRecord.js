// src/models/MedicalRecord.js
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  voiceTranscript: { type: String }, // text from speech-to-text
  notes: { type: String },
  diagnosis: { type: String },
  prescriptions: [{ type: String }],
  attachments: [{ url: String, filename: String }], // optional files
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('MedicalRecord', recordSchema);
