const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  semester: { type: mongoose.Schema.Types.ObjectId, ref: 'Semester', required: true },
  name: { type: String, required: true },
  code: { type: String },
  teacher: { type: String },
  threshold: { type: Number },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
