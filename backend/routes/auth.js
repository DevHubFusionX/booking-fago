// Authentication routes for user registration, login, and session management

const express = require('express');
const bcrypt = require('bcryptjs');
const database = require('../database');
const { COLLECTIONS, USER_ROLES } = require('../config/constants');

const router = express.Router();

/**
 * User registration endpoint
 * POST /api/register - Creates new user account
 */
router.post('/register', async (req, res) => {
  // Extract user data from request body
  const { name, email, password, phone } = req.body;
  
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Check if email already exists in database
    const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered' });
    }
    
    // Split full name into first and last name
    const [firstName, ...lastNameParts] = name.split(' ');
    
    // Hash password for secure storage (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object
    const newUser = {
      first_name: firstName,
      last_name: lastNameParts.join(' ') || '', // Join remaining parts as last name
      email,
      phone: phone || '', // Optional phone number
      password_hash: hashedPassword, // Store hashed password, never plain text
      role: USER_ROLES.CUSTOMER, // Default role for new users
      created_at: new Date(), // Registration timestamp
      updated_at: new Date() // Last update timestamp
    };
    
    // Insert new user into database
    await db.collection(COLLECTIONS.USERS).insertOne(newUser);
    
    // Return success response
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    // Log error and return generic error message
    console.error('Registration error:', error);
    res.json({ success: false, message: 'Server error during registration' });
  }
});

/**
 * User login endpoint
 * POST /api/login - Authenticates user and creates session
 */
router.post('/login', async (req, res) => {
  // Extract login credentials from request body
  const { email, password } = req.body;
  
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find user by email address
    const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    
    // Verify password hash exists (data integrity check)
    if (!user.password_hash) {
      console.error('User found but no password_hash field:', user);
      return res.json({ success: false, message: 'Account needs to be re-registered' });
    }
    
    // Compare provided password with stored hash
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (isValid) {
      // Create user session with essential user data
      req.session.user = { 
        id: user._id, 
        name: `${user.first_name} ${user.last_name}`, 
        email: user.email,
        role: user.role
      };
      
      // Return success with user data
      res.json({ success: true, user: req.session.user });
    } else {
      // Invalid password
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    // Log error and return generic error message
    console.error('Login error:', error);
    res.json({ success: false, message: 'Server error during login' });
  }
});

/**
 * Get current user session
 * GET /api/user - Returns current logged-in user data
 */
router.get('/user', (req, res) => {
  // Log session information for debugging
  console.log('Session check:', {
    sessionID: req.sessionID,
    user: req.session.user ? 'logged in' : 'not logged in',
    sessionData: req.session
  });
  
  // Return user data if session exists, null otherwise
  res.json({ user: req.session.user || null });
});

/**
 * User logout endpoint
 * POST /api/logout - Destroys user session
 */
router.post('/logout', (req, res) => {
  // Destroy the user session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.json({ success: false, message: 'Logout failed' });
    }
    
    // Session destroyed successfully
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

module.exports = router;