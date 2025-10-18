import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Hospital from './models/Hospital.js';
import User from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to DB for seeding');

    await Hospital.deleteMany({});
    await User.deleteMany({});

    const hospital = new Hospital({ name: 'City Hospital', email: 'contact@cityhospital.com', address: '123 Main St' });
    await hospital.save();

    const admin = new User({ name: 'Sys Admin', email: 'admin@sys.com', password: 'admin123', role: 'admin' });
    await admin.save();

    const doctor = new User({ name: 'Dr. Alice', email: 'alice@doc.com', password: 'doctor123', role: 'doctor', hospitalIds: [hospital._id] });
    await doctor.save();

    const patient = new User({ name: 'Bob Patient', email: 'bob@patient.com', password: 'patient123', role: 'patient', doctorId: doctor._id, hospitalIds: [hospital._id] });
    await patient.save();

    console.log('Seed done. Credentials:');
    console.log('admin -> email: admin@sys.com / password: admin123');
    console.log('doctor -> email: alice@doc.com / password: doctor123');
    console.log('patient -> email: bob@patient.com / password: patient123');
    console.log('Hospital id:', hospital._id.toString());
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
