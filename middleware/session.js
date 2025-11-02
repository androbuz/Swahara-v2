/**
 * Initialize session data
 * Sets up default session values if they don't exist
 */
function initializeSession(req, res, next) {
  if (req.session.isLoggedIn === undefined) {
    req.session.isLoggedIn = false;
  }
  
  next();
}

module.exports = {
  initializeSession
};
