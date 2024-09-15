const Student = require('../models/Student');

// @desc    Create a new student
// @route   POST /api/students
const createStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const student = new Student({ name, email, password });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get student details with subjects
// @route   GET /api/students/:id
const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Add a subject to a student
// @route   POST /api/students/:id/subjects
const addSubject = async (req, res) => {
  try {
    const { name, attendanceCriteria } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.subjects.push({ name, attendanceCriteria: attendanceCriteria || 75 });
    await student.save();
    
    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update attendance for a subject
// @route   PUT /api/students/:studentId/subjects/:subjectId
const updateAttendance = async (req, res) => {
  try {
    const { attendedClasses, totalClasses, status, date } = req.body;
    const student = await Student.findById(req.params.studentId);
    
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const subject = student.subjects.id(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    if (attendedClasses !== undefined) subject.attendedClasses = attendedClasses;
    if (totalClasses !== undefined) subject.totalClasses = totalClasses;

    // Push history record
    if (status) {
      subject.history.push({
        status,
        date: date || new Date()
      });
    }

    await student.save();
    
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update student settings (profile, academic, preferences, semesters)
// @route   PUT /api/students/:id/settings
const updateSettings = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Update simple fields if provided
    const updatableFields = ['name', 'email', 'rollNumber', 'college', 'department', 'currentSemester', 'academicYear', 'division', 'defaultThreshold', 'workingDays', 'semesters'];
    
    updatableFields.forEach(field => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    // If updating password
    if (req.body.password) {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(req.body.password, salt);
    }

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createStudent, getStudent, addSubject, updateAttendance, updateSettings };
