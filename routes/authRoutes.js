const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const { redirectIfAuthenticated } = require('../middleware/auth');
const path = require('path');

// Set up multer for file uploads
const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Login routes
router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', authController.login);

// Signup routes
router.get('/signup', authController.showSignup);
router.post('/signup', upload.single('avatar'), authController.signup); // Handle avatar upload

// Logout route
router.get('/logout', authController.logout);

module.exports = router;
