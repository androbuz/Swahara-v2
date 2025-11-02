const User = require('../models/User');

class UserController {
  // Show user profile
  async showProfile(req, res) {
    try {
      const currentUser = await User.getCurrentUser(req.session.user.id);
      console.log('Current User:', currentUser);
      res.render('profile', {
        currentUser
      });
    } catch (error) {
      console.error('Error in showProfile:', error);
      res.status(500).render('error', { error });
    }
  }
}

module.exports = new UserController();
