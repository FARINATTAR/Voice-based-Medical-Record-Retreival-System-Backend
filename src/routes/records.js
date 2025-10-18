// import express from 'express';
// import MedicalRecord from '../models/MedicalRecord.js';

// const router = express.Router();

// // POST /records — create new record
// router.post('/', async (req, res) => {
//   try {
//     const record = new MedicalRecord(req.body);
//     const saved = await record.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET records for doctor
// router.get('/doctor/:doctorId', async (req, res) => {
//   try {
//     const records = await MedicalRecord.find({ doctorId: req.params.doctorId });
//     res.json(records);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET records for patient
// router.get('/patient/:patientId', async (req, res) => {
//   try {
//     const records = await MedicalRecord.find({ patientId: req.params.patientId });
//     res.json(records);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// create record - only doctor role allowed
router.post('/', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { patientId, hospitalId, voiceTranscript, notes, diagnosis, prescriptions } = req.body;
    const doctorId = req.user._id; // from token
    if (!patientId || !hospitalId) return res.status(400).json({ message: 'Missing patientId or hospitalId' });

    const record = new MedicalRecord({
      patientId, doctorId, hospitalId,
      voiceTranscript, notes, diagnosis,
      prescriptions: prescriptions || []
    });

    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get records by doctor
router.get('/doctor/:doctorId', authenticate, authorize('doctor','admin','hospital'), async (req, res) => {
  try {
    const { doctorId } = req.params;
    // doctors can only fetch their own records unless admin/hospital
    if (req.user.role === 'doctor' && String(req.user._id) !== String(doctorId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const records = await MedicalRecord.find({ doctorId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get records by patient
router.get('/:patientId', authenticate, authorize('doctor','patient','admin','hospital'), async (req, res) => {
  try {
    const { patientId } = req.params;
    // patient can see only their own
    if (req.user.role === 'patient' && String(req.user._id) !== String(patientId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const records = await MedicalRecord.find({ patientId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
