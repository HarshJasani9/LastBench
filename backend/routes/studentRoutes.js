const express = require('express');
const router = express.Router();
const { 
  createStudent, 
  getStudent, 
  addSubject, 
  updateAttendance 
} = require('../controllers/studentController');

router.post('/', createStudent);
router.get('/:id', getStudent);
router.post('/:id/subjects', addSubject);
router.put('/:studentId/subjects/:subjectId', updateAttendance);

module.exports = router;
