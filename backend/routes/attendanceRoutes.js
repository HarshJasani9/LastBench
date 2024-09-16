const express = require('express');
const router = express.Router();
const { markAttendance, getBunkStatus, getHistory, deleteAttendance } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/mark', protect, markAttendance);
router.get('/bunk-status', protect, getBunkStatus);
router.get('/history', protect, getHistory);
router.delete('/:id', protect, deleteAttendance);

module.exports = router;
