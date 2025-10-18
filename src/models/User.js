// // src/models/User.js
// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['hospital','doctor','patient'], required: true },
//   hospitalIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }], // doctor/patient can belong to multiple hospitals
//   createdAt: { type: Date, default: Date.now }
// });

// // hash password before save
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// // compare password
// userSchema.methods.comparePassword = async function(candidate) {
//   return await bcrypt.compare(candidate, this.password);
// };

// export default mongoose.model('User', userSchema);
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['hospital','doctor','patient','admin'], required: true },
  hospitalIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }], // hospitals the user belongs to
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // for patient -> primary doctor
  createdAt: { type: Date, default: Date.now }
});

// hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// compare
userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
