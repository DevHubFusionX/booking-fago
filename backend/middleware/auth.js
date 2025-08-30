// Authentication middleware for protecting routes

/**
 * Middleware to check if user is authenticated
 * Verifies that user session exists before allowing access to protected routes
 */
function requireAuth(req, res, next) {
  // Check if user session exists
  if (!req.session.user) {
    return res.json({ 
      success: false, 
      message: 'Authentication required. Please login first.' 
    });
  }
  
  // User is authenticated, proceed to next middleware/route handler
  next();
}

/**
 * Middleware to check if user is admin
 * Verifies user has admin role for admin-only operations
 */
function requireAdmin(req, res, next) {
  // First check if user is authenticated
  if (!req.session.user) {
    return res.json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }
  
  // Check if user has admin role
  if (req.session.user.role !== 'admin') {
    return res.json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }
  
  // User is admin, proceed to next middleware/route handler
  next();
}

/**
 * Optional authentication middleware
 * Allows access but adds user info if authenticated
 */
function optionalAuth(req, res, next) {
  // Add user info to request if session exists, but don't block if not
  req.user = req.session.user || null;
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth
};