const mongoose = require('mongoose');

const semesterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  defaultThreshold: { type: Number, default: 75 },
  isActive: { type: Boolean, default: false }
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  attendedClasses: { type: Number, default: 0 },
  totalClasses: { type: Number, default: 0 },
  attendanceCriteria: { type: Number, default: 75 }, // Configurable percentage per subject/student
  semesterId: { type: mongoose.Schema.Types.ObjectId }, // Link to a semester
  history: [{
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent'] }
  }]
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for OAuth users
  googleId: { type: String }, // For Google OAuth
  rollNumber: { type: String },
  
  // Academic info
  college: { type: String, default: '' },
  department: { type: String, default: '' },
  currentSemester: { type: String, default: 'SEM 1' },
  academicYear: { type: String, default: '' },
  division: { type: String, default: '' },
  
  // Preferences
  defaultThreshold: { type: Number, default: 75 },
  workingDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  
  subjects: [subjectSchema],
  semesters: [semesterSchema],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
