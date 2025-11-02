const express = require('express');
const session = require('express-session');
const path = require('path');

// Import configurations
const appConfig = require('./config/app');
const sessionConfig = require('./config/session');
const database = require('./config/database');

// Import middleware
const { initializeSession } = require('./middleware/session');

// Import routes
const routes = require('./routes');

// Create Express app
const app = express();

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
// using another static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session middleware
app.use(session(sessionConfig));

// Initialize session data
app.use(initializeSession);

// View engine setup
app.set('view engine', appConfig.viewEngine);
app.set('views', path.join(__dirname, appConfig.viewsPath));

// Initialize database connection
database.connect().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    error: appConfig.env === 'development' ? err : {} 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404');
});

module.exports = app;
