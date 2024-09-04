const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attendedClasses: { type: Number, default: 0 },
  totalClasses: { type: Number, default: 0 },
  attendanceCriteria: { type: Number, default: 75 }, // Configurable percentage per subject/student
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  googleId: { type: String }, // For Google OAuth
  subjects: [subjectSchema],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
