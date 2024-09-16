const express = require('express');
const router = express.Router();
const { getSemesters, createSemester, updateSemester, activateSemester, deleteSemester } = require('../controllers/semesterController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSemesters).post(protect, createSemester);
router.route('/:id').put(protect, updateSemester).delete(protect, deleteSemester);
router.put('/:id/activate', protect, activateSemester);

module.exports = router;
