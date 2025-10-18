// // // src/routes/patient.js
// // import express from 'express';
// // import { auth, authorizeRoles } from '../middlewares/auth.js';
// // import MedicalRecord from '../models/MedicalRecord.js';

// // const router = express.Router();

// // // fetch own records (patient only)
// // router.get('/myRecords', auth, authorizeRoles('patient'), async (req, res) => {
// //   try {
// //     const records = await MedicalRecord.find({ patientId: req.user.id })
// //       .populate('doctorId', 'name')
// //       .populate('hospitalId', 'name')
// //       .sort({ createdAt: -1 });
// //     res.json({ records });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// // export default router;
// import express from 'express';
// import User from '../models/User.js';
// import { authenticate, authorize } from '../middlewares/auth.js';

// const router = express.Router();

// // get patients
// router.get('/', authenticate, authorize('admin','doctor','hospital'), async (req, res) => {
//   try {
//     const patients = await User.find({ role: 'patient' }).select('-password');
//     res.json(patients);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // add patient (doctor or admin)
// router.post('/', authenticate, authorize('admin','doctor'), async (req, res) => {
//   try {
//     const { name, email, password, doctorId, hospitalId } = req.body;
//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: 'Patient exists' });
//     const patient = new User({ name, email, password, role: 'patient' });
//     if (doctorId) patient.doctorId = doctorId;
//     if (hospitalId) patient.hospitalIds = [hospitalId];
//     await patient.save();
//     res.status(201).json({ id: patient._id, name: patient.name, email: patient.email });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// export default router;
import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();

// GET all patients (doctor, hospital, admin)
router.get('/', authenticate, authorize('admin','hospital','doctor'), async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD a new patient (doctor or hospital)
router.post('/', authenticate, authorize('admin','hospital','doctor'), async (req, res) => {
  try {
    const { name, email, password, doctorId, hospitalIds } = req.body;

    // Check if patient already exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Patient already exists' });

    // Create new patient
    const patient = new User({
      name,
      email,
      password,
      role: 'patient',
      doctorId: doctorId || null,
      hospitalIds: Array.isArray(hospitalIds) ? hospitalIds : hospitalIds ? [hospitalIds] : []
    });

    await patient.save();

    res.status(201).json({
      id: patient._id,
      name: patient.name,
      email: patient.email,
      doctorId: patient.doctorId,
      hospitalIds: patient.hospitalIds
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
