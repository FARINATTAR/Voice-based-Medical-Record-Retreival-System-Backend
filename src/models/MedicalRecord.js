// import mongoose from 'mongoose';

// const MedicalRecordSchema = new mongoose.Schema({
//   patientId: { type: String, required: true },
//   doctorId: { type: String, required: true },
//   hospitalId: { type: String, required: true },
//   voiceTranscript: { type: String },
//   notes: { type: String },
//   diagnosis: { type: String },
//   prescriptions: [{ type: String }]
// }, { timestamps: true });

// export default mongoose.model('MedicalRecord', MedicalRecordSchema);
import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  voiceTranscript: { type: String },
  notes: { type: String },
  diagnosis: { type: String },
  prescriptions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('MedicalRecord', MedicalRecordSchema);
