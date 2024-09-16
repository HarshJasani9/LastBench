const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const Semester = require('../models/Semester');
const User = require('../models/User');

exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, status, date } = req.body;
    const att = await Attendance.create({ student: req.user.id, subject: subjectId, status, date: date || new Date() });
    res.status(201).json(att);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getBunkStatus = async (req, res) => {
  try {
    const activeSem = await Semester.findOne({ user: req.user.id, isActive: true });
    if (!activeSem) return res.json([]);
    const subjects = await Subject.find({ semester: activeSem._id });
    const user = await User.findById(req.user.id);
    
    const statusArray = await Promise.all(subjects.map(async (sub) => {
      const records = await Attendance.find({ student: req.user.id, subject: sub._id });
      const present = records.filter(r => r.status === 'present').length;
      const total = records.length;
      const thresh = sub.threshold || activeSem.defaultThreshold || user.defaultThreshold || 75;
      
      const safeToMiss = total > 0 ? Math.floor((present - (thresh/100) * total) / (thresh/100)) : 0;
      
      return { subject: sub, present, total, safeToMiss, records };
    }));
    res.json(statusArray);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.getHistory = async (req, res) => {
  try {
    const records = await Attendance.find({ student: req.user.id }).populate('subject').sort({ date: -1 });
    res.json(records);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteAttendance = async (req, res) => {
  try {
    await Attendance.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
