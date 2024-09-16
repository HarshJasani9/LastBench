const Semester = require('../models/Semester');

exports.getSemesters = async (req, res) => {
  try {
    const sems = await Semester.find({ user: req.user.id });
    res.json(sems);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.createSemester = async (req, res) => {
  try {
    const { name, startDate, endDate, defaultThreshold, isActive } = req.body;
    if (isActive) await Semester.updateMany({ user: req.user.id }, { isActive: false });
    const sem = await Semester.create({ user: req.user.id, name, startDate, endDate, defaultThreshold, isActive });
    res.status(201).json(sem);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateSemester = async (req, res) => {
  try {
    const sem = await Semester.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sem);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.activateSemester = async (req, res) => {
  try {
    await Semester.updateMany({ user: req.user.id }, { isActive: false });
    const sem = await Semester.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    res.json(sem);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteSemester = async (req, res) => {
  try {
    await Semester.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(400).json({ message: err.message }); }
};
