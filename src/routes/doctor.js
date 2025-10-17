// src/routes/doctor.js
import express from 'express';
import { auth, authorizeRoles } from '../middlewares/auth.js';
import MedicalRecord from '../models/MedicalRecord.js';
import User from '../models/User.js';

const router = express.Router();

// add medical record (doctor only)
router.post('/addRecord', auth, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { patientId, hospitalId, voiceTranscript, notes, diagnosis, prescriptions } = req.body;
    if (!patientId || !hospitalId)
      return res.status(400).json({ message: 'Missing patientId or hospitalId' });

    const record = new MedicalRecord({
      patientId,
      doctorId: req.user.id,
      hospitalId,
      voiceTranscript,
      notes,
      diagnosis,
      prescriptions
    });

    await record.save();
    res.status(201).json({ message: 'Record added', recordId: record._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// voice search for patients (doctor only)
router.get('/voiceSearch', auth, authorizeRoles('doctor'), async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ message: 'Missing query' });

    const patients = await User.find({
      role: 'patient',
      name: { $regex: q, $options: 'i' }
    }).select('name email hospitalIds');

    res.json({ results: patients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get patient's records (doctor only)
router.get('/patientRecords/:patientId', auth, authorizeRoles('doctor'), async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await MedicalRecord.find({ patientId })
      .populate('doctorId', 'name')
      .populate('hospitalId', 'name')
      .sort({ createdAt: -1 });
    res.json({ records });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
