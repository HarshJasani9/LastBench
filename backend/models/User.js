const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  avatar: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  college: { type: String },
  branch: { type: String },
  division: { type: String },
  rollNumber: { type: String },
  defaultThreshold: { type: Number, default: 75 },
  workingDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
