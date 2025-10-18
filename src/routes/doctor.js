// // src/routes/doctor.js
// import express from 'express';
// import { auth, authorizeRoles } from '../middlewares/auth.js';
// import MedicalRecord from '../models/MedicalRecord.js';
// import User from '../models/User.js';

// const router = express.Router();

// // add medical record (doctor only)
// router.post('/addRecord', auth, authorizeRoles('doctor'), async (req, res) => {
//   try {
//     const { patientId, hospitalId, voiceTranscript, notes, diagnosis, prescriptions } = req.body;
//     if (!patientId || !hospitalId)
//       return res.status(400).json({ message: 'Missing patientId or hospitalId' });

//     const record = new MedicalRecord({
//       patientId,
//       doctorId: req.user.id,
//       hospitalId,
//       voiceTranscript,
//       notes,
//       diagnosis,
//       prescriptions
//     });

//     await record.save();
//     res.status(201).json({ message: 'Record added', recordId: record._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // voice search for patients (doctor only)
// router.get('/voiceSearch', auth, authorizeRoles('doctor'), async (req, res) => {
//   try {
//     const q = req.query.q;
//     if (!q) return res.status(400).json({ message: 'Missing query' });

//     const patients = await User.find({
//       role: 'patient',
//       name: { $regex: q, $options: 'i' }
//     }).select('name email hospitalIds');

//     res.json({ results: patients });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // get patient's records (doctor only)
// router.get('/patientRecords/:patientId', auth, authorizeRoles('doctor'), async (req, res) => {
//   try {
//     const { patientId } = req.params;
//     const records = await MedicalRecord.find({ patientId })
//       .populate('doctorId', 'name')
//       .populate('hospitalId', 'name')
//       .sort({ createdAt: -1 });
//     res.json({ records });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// GET all doctors (accessible by admin, hospital, doctor)
router.get('/', authenticate, authorize('admin','hospital','doctor'), async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a new doctor (accessible by admin or hospital)
router.post('/', authenticate, authorize('admin','hospital'), async (req, res) => {
  try {
    const { name, email, password, hospitalIds } = req.body; // allow multiple hospitals
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Doctor exists' });

    // Ensure hospitalIds is an array of ObjectIds
    const doctor = new User({
      name,
      email,
      password,
      role: 'doctor',
      hospitalIds: Array.isArray(hospitalIds) ? hospitalIds : hospitalIds ? [hospitalIds] : []
    });

    await doctor.save();
    res.status(201).json({
      id: doctor._id,
      name: doctor.name,
      email: doctor.email,
      hospitalIds: doctor.hospitalIds
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
