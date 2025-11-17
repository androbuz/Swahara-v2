const User = require('../models/User');
const path = require('path');

class AuthController {
  // Show login page
  showLogin(req, res) {
    const message = req.query.message;
    res.render('login', { message });
  }

  // Show signup page
  showSignup(req, res) {
    const message = req.query.message;
    res.render('signup', { message });
  }

  // Handle signup
  async signup(req, res) {
    try {
      const { name, phone, password, confirmPassword } = req.body;

      // Validate passwords match
      if (password !== confirmPassword) {
        return res.render('signup', { 
          message: 'Passwords do not match' 
        });
      }

      // Check if user already exists
      const existingUser = await User.findByPhone(phone);
      if (existingUser) {
        return res.render('signup', { 
          message: 'Phone number already registered' 
        });
      }

      // Store only the filename of the uploaded avatar
      const avatarFilename = req.file ? req.file.filename : null;
      const user = await User.create(name, phone, password, avatarFilename);

      // Set session
      req.session.user = {
        id: user.id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        initials: user.initials
      };
      req.session.isLoggedIn = true;

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error in signup:', error);
      res.render('signup', { 
        message: 'An error occurred during signup' 
      });
    }
  }

  // Handle login
  async login(req, res) {
    try {
      const { phone, password } = req.body;
    
      // Find user by phone number
      const user = await User.findByPhone(phone);
      
      // Check if user exists and password matches
      if (!user || !User.validatePassword(phone, password)) {
        return res.render('login', { 
          message: 'Invalid phone number or password' 
        });
      }

      req.session.user = {
        id: user.id,
        phone: user.phone,
        name: user.name,
        avatar: user.avatar,
        initials: user.initials
      };
      req.session.isLoggedIn = true;
      
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Error in login:', error);
      res.render('login', { 
        message: 'An error occurred during login' 
      });
    }
  }

  // Handle logout
  logout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/login?message=Logged out successfully');
    });
  }
}

module.exports = new AuthController();