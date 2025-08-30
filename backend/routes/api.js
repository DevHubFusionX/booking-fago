// General API routes for hotels, deals, contact, and system health

const express = require('express');
const database = require('../database');
const { COLLECTIONS } = require('../config/constants');

const router = express.Router();

/**
 * Get all hotels
 * GET /api/hotels - Returns list of all available hotels
 */
router.get('/hotels', async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Retrieve all hotels from database
    const hotels = await db.collection(COLLECTIONS.HOTELS).find({}).toArray();
    
    // Return hotels list
    res.json({ success: true, hotels });
  } catch (error) {
    // Log error and return error response
    console.error('Hotels retrieval error:', error);
    res.json({ success: false, message: 'Failed to retrieve hotels' });
  }
});

/**
 * Get specific hotel details
 * GET /api/hotels/:id - Returns detailed information for specific hotel
 */
router.get('/hotels/:id', async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find hotel by ID (string ID, not ObjectId)
    const hotel = await db.collection(COLLECTIONS.HOTELS).findOne({ _id: req.params.id });
    
    // Check if hotel exists
    if (!hotel) {
      return res.json({ success: false, message: 'Hotel not found' });
    }
    
    // Return hotel details
    res.json({ success: true, hotel });
  } catch (error) {
    // Log error and return error response
    console.error('Hotel details error:', error);
    res.json({ success: false, message: 'Failed to retrieve hotel details' });
  }
});

/**
 * Submit contact form
 * POST /api/contact - Saves contact form submission to database
 */
router.post('/contact', async (req, res) => {
  // Extract form data from request body
  const { name, email, subject, message } = req.body;
  
  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.json({ 
      success: false, 
      message: 'All fields are required' 
    });
  }
  
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Create contact message record
    const contactMessage = {
      name, // Sender's name
      email, // Sender's email
      subject, // Message subject
      message, // Message content
      status: 'unread', // Initial status
      created_at: new Date() // Submission timestamp
    };
    
    // Insert contact message into database
    await db.collection(COLLECTIONS.CONTACTS).insertOne(contactMessage);
    
    // Return success response
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    // Log error and return error response
    console.error('Contact form error:', error);
    res.json({ success: false, message: 'Failed to send message' });
  }
});

/**
 * Get active deals and promotions
 * GET /api/deals - Returns list of active deals
 */
router.get('/deals', async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find only active deals, sorted by creation date
    const deals = await db.collection(COLLECTIONS.DEALS)
      .find({ active: true }) // Only active deals
      .sort({ created_at: -1 }) // Newest first
      .toArray();
    
    // Return deals list
    res.json({ success: true, deals });
  } catch (error) {
    // Log error and return error response
    console.error('Deals retrieval error:', error);
    res.json({ success: false, message: 'Failed to retrieve deals' });
  }
});

/**
 * Database connection test endpoint
 * GET /api/test - Tests database connectivity
 */
router.get('/test', async (req, res) => {
  try {
    // Test database connection
    const testResult = await database.testConnection();
    
    // Return test results
    res.json({ 
      success: testResult.connected, 
      ...testResult 
    });
  } catch (error) {
    // Log error and return error response
    console.error('Database test error:', error);
    res.json({ 
      success: false, 
      message: error.message, 
      connected: false 
    });
  }
});

/**
 * Application health check endpoint
 * GET /api/health - Returns application health status
 */
router.get('/health', async (req, res) => {
  try {
    // Get database connection
    const db = database.getDb();
    if (!db) {
      // Database not connected - unhealthy
      return res.status(503).json({ 
        status: 'unhealthy', 
        message: 'Database not connected' 
      });
    }
    
    // Test database connectivity with ping
    await db.admin().ping();
    
    // All systems operational
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(), // Current timestamp
      database: 'connected', // Database status
      version: '1.0.0' // Application version
    });
  } catch (error) {
    // Database ping failed - unhealthy
    res.status(503).json({ 
      status: 'unhealthy', 
      error: error.message 
    });
  }
});

module.exports = router;