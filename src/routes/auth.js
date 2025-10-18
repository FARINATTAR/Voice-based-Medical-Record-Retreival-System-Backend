// // src/routes/auth.js
// import express from 'express';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const router = express.Router();

// // signup (common)
// router.post('/signup', async (req, res) => {
//   try {
//     const { name, email, password, role, hospitalIds } = req.body;
//     if (!name || !email || !password || !role)
//       return res.status(400).json({ message: 'Missing fields' });

//     if (!['hospital','doctor','patient'].includes(role))
//       return res.status(400).json({ message: 'Invalid role' });

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: 'Email already registered' });

//     const user = new User({ name, email, password, role, hospitalIds });
//     await user.save();

//     res.status(201).json({ message: 'User created', userId: user._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // login
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const matched = await user.comparePassword(password);
//     if (!matched) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
//     );

//     res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Hospital from '../models/Hospital.js';
dotenv.config();

const router = express.Router();

// signup - role must be supplied ('hospital'|'doctor'|'patient'|'admin')
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role, hospitalId, doctorId } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password, role });

    if (role === 'doctor' && hospitalId) newUser.hospitalIds = [hospitalId];
    if (role === 'patient') {
      if (hospitalId) newUser.hospitalIds = [hospitalId];
      if (doctorId) newUser.doctorId = doctorId;
    }

    await newUser.save();

    // return token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, hospitalIds: newUser.hospitalIds } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const matched = await user.comparePassword(password);
    if (!matched) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, hospitalIds: user.hospitalIds } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
