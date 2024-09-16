const Subject = require('../models/Subject');
const Semester = require('../models/Semester');

exports.getSubjects = async (req, res) => {
  try {
    const activeSem = await Semester.findOne({ user: req.user.id, isActive: true });
    if (!activeSem) return res.json([]);
    const subjects = await Subject.find({ semester: activeSem._id });
    res.json(subjects);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.addSubject = async (req, res) => {
  try {
    const activeSem = await Semester.findOne({ user: req.user.id, isActive: true });
    if (!activeSem) return res.status(400).json({ message: 'No active semester' });
    const { name, code, teacher, threshold } = req.body;
    const sub = await Subject.create({ semester: activeSem._id, name, code, teacher, threshold, students: [req.user.id] });
    res.status(201).json(sub);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateSubject = async (req, res) => {
  try {
    const sub = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sub);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteSubject = async (req, res) => {
  try {
    await Subject.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
