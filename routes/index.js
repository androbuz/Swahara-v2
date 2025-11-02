const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./authRoutes');
const agreementRoutes = require('./agreementRoutes');
const userRoutes = require('./userRoutes');

// Authentication guard 
function ensureAuthenticated(req, res, next) {
  const sessionAuth = req.session && (req.session.user || req.session.userId);
  if (sessionAuth) return next();
  return res.redirect('/login');
}

// Home route
router.get('/', (req, res) => {
  const sessionAuth = req.session && (req.session.user || req.session.userId);
  if (sessionAuth) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// Mount routes
router.use('/', authRoutes);
router.use('/', ensureAuthenticated, agreementRoutes); // protect agreement routes
router.use('/', ensureAuthenticated, userRoutes); 

module.exports = router;
