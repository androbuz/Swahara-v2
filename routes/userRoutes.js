const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

// Profile route
router.get('/profile', requireAuth, userController.showProfile);

module.exports = router;
