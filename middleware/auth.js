/**
 * Authentication middleware
 * Checks if user is logged in before allowing access to protected routes
 */
function requireAuth(req, res, next) {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
}

/**
 * Redirect authenticated users
 * Redirects to dashboard if user is already logged in
 */
function redirectIfAuthenticated(req, res, next) {
  if (req.session.isLoggedIn) {
    return res.redirect('/dashboard');
  }
  next();
}

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};
