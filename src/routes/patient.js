// src/routes/patient.js
import express from 'express';
import { auth, authorizeRoles } from '../middlewares/auth.js';
import MedicalRecord from '../models/MedicalRecord.js';

const router = express.Router();

// fetch own records (patient only)
router.get('/myRecords', auth, authorizeRoles('patient'), async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id })
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
