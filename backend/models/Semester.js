const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  isActive: { type: Boolean, default: false },
  defaultThreshold: { type: Number, default: 75 }
}, { timestamps: true });

module.exports = mongoose.model('Semester', semesterSchema);
