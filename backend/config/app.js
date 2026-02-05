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
  // Trust proxy for secure sessions on Render
  app.set('trust proxy', 1);

  // Enable Cross-Origin Resource Sharing for API access
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://booking-fago.onrender.com',
    process.env.FRONTEND_URL
  ].filter(Boolean);

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        // Return null instead of Error to avoid 500 error in Express
        // The cors middleware will handle this by not setting CORS headers
        return callback(null, false);
      }
    },
    credentials: true // Allow cookies/sessions across origins
  }));

  // Parse JSON request bodies (for API endpoints)
  app.use(express.json());

  // Parse URL-encoded form data (for form submissions)
  app.use(express.urlencoded({ extended: true }));

  // Serve static files from frontend directory
  app.use(express.static(path.join(__dirname, '../../frontend')));

  // Configure session management for user authentication
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(session({
    secret: process.env.SESSION_SECRET || 'fagos-booking-secret', // Use environment variable for secret
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    proxy: isProduction, // Trust the reverse proxy in production
    cookie: {
      secure: isProduction, // Set to true in production with HTTPS
      httpOnly: true, // Prevent XSS attacks by making cookie inaccessible to JavaScript
      maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours
      sameSite: isProduction ? 'none' : 'lax' // Required for cross-site cookies in production
    }
  }));
}

module.exports = { app, setupMiddleware };