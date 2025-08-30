// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const session = require('express-session');
const path = require('path');
const cors = require('cors');

// Create Express application instance
const app = express();

// Configure middleware
function setupMiddleware(app) {
  // Enable Cross-Origin Resource Sharing for API access
  app.use(cors());
  
  // Parse JSON request bodies (for API endpoints)
  app.use(express.json());
  
  // Parse URL-encoded form data (for form submissions)
  app.use(express.urlencoded({ extended: true }));
  
  // Serve static files from frontend directory
  app.use(express.static(path.join(__dirname, '../../frontend')));
  
  // Configure session management for user authentication
  app.use(session({
    secret: 'fagos-booking-secret', // Secret key for session encryption
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks by making cookie inaccessible to JavaScript
      maxAge: 24 * 60 * 60 * 1000 // Session expires after 24 hours
    }
  }));
}

module.exports = { app, setupMiddleware };