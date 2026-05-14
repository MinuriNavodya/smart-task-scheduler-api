const express  = require('express');
const router   = express.Router();
const protect  = require('../middleware/authMiddleware');
const { register, login, getMe, updateProfile } = require('../controllers/authController');

// Public routes
router.post('/register', register);   // POST /api/auth/register
router.post('/login',    login);      // POST /api/auth/login

// Private routes (require token)
router.get('/me',          protect, getMe);           // GET /api/auth/me
router.put('/profile',     protect, updateProfile);   // PUT /api/auth/profile

module.exports = router;
