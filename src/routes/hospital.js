// src/routes/hospital.js
import express from 'express';
import { auth, authorizeRoles } from '../middlewares/auth.js';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';

const router = express.Router();

// add doctor under logged-in hospital
router.post('/addDoctor', auth, authorizeRoles('hospital'), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hospitalUser = req.user;

    const doctor = new User({ name, email, password, role: 'doctor', hospitalIds: [hospitalUser.id] });
    await doctor.save();

    let hospDoc = await Hospital.findById(hospitalUser.id);
    if (!hospDoc) hospDoc = new Hospital({ _id: hospitalUser.id, name: hospitalUser.name, doctors: [doctor._id] });
    else hospDoc.doctors.push(doctor._id);
    await hospDoc.save();

    res.status(201).json({ message: 'Doctor added', doctorId: doctor._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// add patient under logged-in hospital
router.post('/addPatient', auth, authorizeRoles('hospital'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const hospitalUser = req.user;
    const randomPassword = Math.random().toString(36).slice(-8);

    const patient = new User({ name, email, password: randomPassword, role: 'patient', hospitalIds: [hospitalUser.id] });
    await patient.save();

    let hospDoc = await Hospital.findById(hospitalUser.id);
    if (!hospDoc) hospDoc = new Hospital({ _id: hospitalUser.id, name: hospitalUser.name, patients: [patient._id] });
    else hospDoc.patients.push(patient._id);
    await hospDoc.save();

    res.status(201).json({ message: 'Patient added', patientId: patient._id, tempPassword: randomPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get hospital's doctors & patients
router.get('/members', auth, authorizeRoles('hospital'), async (req, res) => {
  try {
    const hospitalUser = req.user;
    const hospDoc = await Hospital.findById(hospitalUser.id)
      .populate('doctors', 'name email')
      .populate('patients', 'name email');
    res.json({ hospital: hospDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
