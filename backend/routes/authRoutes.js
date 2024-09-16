const express = require('express');
const router = express.Router();
const { register, login, me, google } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', google);
router.get('/me', protect, me);

module.exports = router;
