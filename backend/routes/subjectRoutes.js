const express = require('express');
const router = express.Router();
const { getSubjects, addSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getSubjects).post(protect, addSubject);
router.route('/:id').put(protect, updateSubject).delete(protect, deleteSubject);

module.exports = router;
