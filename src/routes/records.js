import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// POST /records - Create a new medical record (Doctor only)
router.post('/', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, hospitalId, voiceTranscript, notes, diagnosis, prescriptions } = req.body;
    const doctorId = req.user.id || req.user._id; // ensure correct ID from token

    if (!patientId || !hospitalId) {
      return res.status(400).json({ message: 'Missing patientId or hospitalId' });
    }

    const record = new MedicalRecord({
      patientId,
      doctorId,
      hospitalId,
      voiceTranscript,
      notes,
      diagnosis,
      prescriptions: Array.isArray(prescriptions) ? prescriptions : []
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /records/doctor/:doctorId - Get records for a doctor
router.get('/doctor/:doctorId', authenticate, authorize('doctor','admin','hospital'), async (req, res) => {
  try {
    const { doctorId } = req.params;

    // Doctor can only fetch their own records
    if (req.user.role === 'doctor' && String(req.user.id) !== String(doctorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const records = await MedicalRecord.find({ doctorId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /records/patient/:patientId - Get records for a patient
router.get('/patient/:patientId', authenticate, authorize('doctor','patient','admin','hospital'), async (req, res) => {
  try {
    const { patientId } = req.params;

    // Patient can only see their own records
    if (req.user.role === 'patient' && String(req.user.id) !== String(patientId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const records = await MedicalRecord.find({ patientId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
