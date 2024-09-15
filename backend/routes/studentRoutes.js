const express = require('express');
const router = express.Router();
const { 
  createStudent, 
  getStudent, 
  addSubject, 
  updateAttendance,
  updateSettings 
} = require('../controllers/studentController');

router.post('/', createStudent);
router.get('/:id', getStudent);
router.put('/:id/settings', updateSettings);
router.post('/:id/subjects', addSubject);
router.put('/:studentId/subjects/:subjectId', updateAttendance);

module.exports = router;
