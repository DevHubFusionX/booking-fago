/**
 * FAGO'S BOOKING - HOTEL BOOKING SYSTEM
 * =====================================
 * 
 * Main server file for the hotel booking application.
 * This file handles:
 * - MongoDB Atlas database connection
 * - User authentication (register/login/logout)
 * - Paystack payment integration
 * - Hotel and booking management
 * - API endpoints for frontend communication
 * - Static file serving for the frontend
 * 
 * Technologies used:
 * - Node.js with Express.js framework
 * - MongoDB Atlas for data persistence
 * - Paystack for payment processing
 * - bcryptjs for password hashing
 * - express-session for user sessions
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// Load environment variables from .env file
require('dotenv').config();

// Import required dependencies
const express = require('express');           // Web framework for Node.js
const session = require('express-session');   // Session middleware for user authentication
const bcrypt = require('bcryptjs');           // Password hashing library
const path = require('path');                 // File path utilities
const cors = require('cors');                 // Cross-Origin Resource Sharing middleware
const https = require('https');               // HTTPS client for Paystack API calls
const { MongoClient, ObjectId } = require('mongodb'); // MongoDB driver

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001; // Server port (default: 3001)

// ========================================
// DATABASE CONFIGURATION
// ========================================

// MongoDB Atlas connection string
// Contains credentials and database configuration
const MONGODB_URI = 'mongodb+srv://fanyanwu83_db_user:qHYDbHosufdcmMsx@cluster0.ptfvedj.mongodb.net/fagos_booking?retryWrites=true&w=majority&appName=Cluster0';
let db; // Global database connection object

// ========================================
// PAYMENT GATEWAY CONFIGURATION
// ========================================

// Paystack secret key for payment processing
// Should be stored in environment variables for security
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Validate Paystack configuration
if (!PAYSTACK_SECRET_KEY) {
  console.error('⚠️  PAYSTACK_SECRET_KEY not found in environment variables');
  console.error('   Please add your Paystack secret key to the .env file');
}

// ========================================
// DATABASE CONNECTION FUNCTION
// ========================================

/**
 * Connects to MongoDB Atlas with multiple fallback options
 * Tries different SSL/TLS configurations to handle connection issues
 * 
 * @returns {Promise<boolean>} - True if connection successful, false otherwise
 */
async function connectToMongoDB() {
  // Different connection options to handle SSL issues
  const connectionOptions = [
    // Option 1: Standard connection
    {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
    // Option 2: Disable SSL verification (for development)
    {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true
    },
    // Option 3: Force TLS with insecure mode
    {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      tls: true,
      tlsInsecure: true
    }
  ];
  
  // Try each connection option until one succeeds
  for (let i = 0; i < connectionOptions.length; i++) {
    try {
      console.log(`🔄 Trying MongoDB connection option ${i + 1}...`);
      const client = await MongoClient.connect(MONGODB_URI, connectionOptions[i]);
      
      console.log('✅ Connected to MongoDB Atlas');
      db = client.db('fagos_booking'); // Set global database reference
      
      // Test the connection with a ping
      await db.admin().ping();
      console.log('✅ MongoDB connection verified');
      
      return true;
    } catch (error) {
      console.log(`❌ Connection option ${i + 1} failed:`, error.message);
      if (i === connectionOptions.length - 1) {
        console.error('❌ All MongoDB connection attempts failed');
        console.error('   The server will continue without database functionality');
        return false;
      }
    }
  }
}

// Initialize MongoDB connection when server starts
connectToMongoDB();

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// Enable Cross-Origin Resource Sharing for API access
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Configure session middleware for user authentication
app.use(session({
  secret: 'fagos-booking-secret',    // Secret key for session encryption
  resave: false,                     // Don't save session if unmodified
  saveUninitialized: false          // Don't create session until something stored
}));

// ========================================
// HTML PAGE ROUTES
// ========================================
// These routes serve the frontend HTML pages

/**
 * Homepage route
 * Serves the main landing page with hero section and featured hotels
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

/**
 * Hotels listing page
 * Shows all available hotels with filtering and search functionality
 */
app.get('/hotels', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/hotels.html'));
});

/**
 * Individual hotel details page
 * Shows detailed information about a specific hotel
 * Route parameter :id represents the hotel ID
 */
app.get('/hotel/:id', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/hotel-details.html'));
});

/**
 * Booking process page
 * Multi-step booking form with guest details and payment
 */
app.get('/booking', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/booking.html'));
});

/**
 * User dashboard page
 * Shows user's bookings, profile settings, and favorites
 */
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/dashboard.html'));
});

/**
 * Contact page
 * Contact form and company information
 */
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/contact.html'));
});

/**
 * Deals and offers page
 * Shows current promotions and special offers
 */
app.get('/deals', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/deals.html'));
});

/**
 * About page
 * Company information and team details
 */
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/about.html'));
});

/**
 * Authentication page
 * Combined login and registration forms
 */
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/auth.html'));
});

// ========================================
// USER AUTHENTICATION API ROUTES
// ========================================

/**
 * User Registration Endpoint
 * Creates a new user account with hashed password
 * 
 * @route POST /api/register
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password (will be hashed)
 * @param {string} phone - User's phone number (optional)
 * @returns {Object} Success/failure response
 */
app.post('/api/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  try {
    // Check if database is connected
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'Email already registered' });
    }
    
    // Split full name into first and last name
    const [firstName, ...lastNameParts] = name.split(' ');
    
    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user object with proper schema
    const newUser = {
      first_name: firstName,
      last_name: lastNameParts.join(' ') || '',
      email,
      phone: phone || '',
      password_hash: hashedPassword,
      role: 'customer',              // Default role for new users
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Insert user into database
    await db.collection('users').insertOne(newUser);
    
    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

/**
 * User Login Endpoint
 * Authenticates user and creates session
 * 
 * @route POST /api/login
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Object} Success/failure response with user data
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if database is connected
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find user by email
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    
    // Verify password against hashed password
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (isValid) {
      // Create user session
      req.session.user = { 
        id: user._id, 
        name: `${user.first_name} ${user.last_name}`, 
        email: user.email 
      };
      res.json({ success: true, user: req.session.user });
    } else {
      res.json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

/**
 * Get Current User Endpoint
 * Returns the currently logged-in user's information
 * 
 * @route GET /api/user
 * @returns {Object} Current user data or null
 */
app.get('/api/user', (req, res) => {
  res.json({ user: req.session.user || null });
});

/**
 * Database Connection Test Endpoint
 * Tests database connectivity and returns collection statistics
 * 
 * @route GET /api/test
 * @returns {Object} Connection status and collection counts
 */
app.get('/api/test', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: false, message: 'Database not connected', connected: false });
    }
    
    // Test database connection with ping
    await db.admin().ping();
    
    // Count documents in each collection
    const userCount = await db.collection('users').countDocuments();
    const hotelCount = await db.collection('hotels').countDocuments();
    const dealCount = await db.collection('deals').countDocuments();
    
    res.json({ 
      success: true, 
      connected: true,
      collections: {
        users: userCount,
        hotels: hotelCount,
        deals: dealCount
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.json({ success: false, message: error.message, connected: false });
  }
});

/**
 * User Logout Endpoint
 * Destroys user session and logs out user
 * 
 * @route POST /api/logout
 * @returns {Object} Success response
 */
app.post('/api/logout', (req, res) => {
  req.session.destroy(); // Remove user session
  res.json({ success: true });
});

// ========================================
// PAYMENT PROCESSING API ROUTES
// ========================================

/**
 * Initialize Payment Endpoint
 * Creates a payment transaction with Paystack
 * 
 * @route POST /api/payment/initialize
 * @param {string} email - Customer's email
 * @param {number} amount - Payment amount in Naira
 * @param {string} hotelId - ID of the hotel being booked
 * @param {Object} bookingData - Booking details (dates, guests, etc.)
 * @returns {Object} Paystack authorization URL and reference
 */
app.post('/api/payment/initialize', async (req, res) => {
  const { email, amount, hotelId, bookingData } = req.body;
  
  // Check if user is logged in
  if (!req.session.user) {
    return res.json({ success: false, message: 'Please login first' });
  }
  
  // Prepare payment data for Paystack
  const paymentData = {
    email,
    amount: amount * 100, // Convert Naira to kobo (Paystack requirement)
    currency: 'NGN',      // Nigerian Naira
    callback_url: `${req.protocol}://${req.get('host')}/api/payment/verify`,
    metadata: {
      hotel_id: hotelId,
      user_id: req.session.user.id,
      booking_data: JSON.stringify(bookingData) // Store booking details
    }
  };
  
  try {
    // Make API call to Paystack to initialize payment
    const response = await makePaystackRequest('/transaction/initialize', 'POST', paymentData);
    
    if (response.status) {
      // Return Paystack checkout URL to frontend
      res.json({ 
        success: true, 
        authorization_url: response.data.authorization_url,
        reference: response.data.reference
      });
    } else {
      console.error('Paystack error:', response);
      res.json({ success: false, message: response.message || 'Payment initialization failed' });
    }
  } catch (error) {
    console.error('Payment service error:', error);
    res.json({ success: false, message: 'Payment service error: ' + error.message });
  }
});

/**
 * Payment Verification Endpoint
 * Verifies payment with Paystack and saves booking to database
 * This endpoint is called by Paystack after payment completion
 * 
 * @route GET /api/payment/verify
 * @param {string} reference - Paystack transaction reference
 * @redirects User to booking page with success/error status
 */
app.get('/api/payment/verify', async (req, res) => {
  const { reference } = req.query;
  
  try {
    // Verify payment with Paystack
    const response = await makePaystackRequest(`/transaction/verify/${reference}`, 'GET');
    
    if (response.status && response.data.status === 'success') {
      // Payment successful - save booking to database
      const metadata = response.data.metadata;
      const bookingData = JSON.parse(metadata.booking_data);
      
      if (db) {
        // Create booking record
        const newBooking = {
          user_id: new ObjectId(metadata.user_id),
          hotel_id: metadata.hotel_id,
          room_type: bookingData.roomType || 'Standard Room',
          check_in: bookingData.checkin,
          check_out: bookingData.checkout,
          guests: bookingData.guests,
          total_amount: response.data.amount / 100, // Convert back to Naira
          payment_status: 'paid',
          transaction_reference: reference,
          created_at: new Date(),
          updated_at: new Date()
        };
        
        const bookingResult = await db.collection('bookings').insertOne(newBooking);
        
        // Create payment record for audit trail
        const paymentRecord = {
          booking_id: bookingResult.insertedId,
          user_id: new ObjectId(metadata.user_id),
          amount: response.data.amount / 100,
          currency: 'NGN',
          status: 'success',
          transaction_reference: reference,
          paystack_response: {
            paid_at: response.data.paid_at,
            channel: response.data.channel,
            authorization: response.data.authorization
          },
          created_at: new Date()
        };
        
        await db.collection('payments').insertOne(paymentRecord);
      }
      
      // Redirect to success page
      res.redirect('/booking?success=true&ref=' + reference);
    } else {
      // Payment failed
      res.redirect('/booking?error=payment_failed');
    }
  } catch (error) {
    // Verification failed
    res.redirect('/booking?error=verification_failed');
  }
});

// ========================================
// BOOKING MANAGEMENT API ROUTES
// ========================================

/**
 * Get User Bookings Endpoint
 * Retrieves all bookings for the current user
 * 
 * @route GET /api/bookings
 * @returns {Object} Array of user's bookings
 */
app.get('/api/bookings', async (req, res) => {
  // Check if user is authenticated
  if (!req.session.user) {
    return res.json({ success: false, message: 'Not authenticated' });
  }
  
  try {
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find all bookings for the current user
    const userBookings = await db.collection('bookings')
      .find({ user_id: new ObjectId(req.session.user.id) })
      .toArray();
    
    res.json({ success: true, bookings: userBookings });
  } catch (error) {
    console.error('Bookings error:', error);
    res.json({ success: false, message: 'Database error' });
  }
});

// ========================================
// PAYSTACK API HELPER FUNCTION
// ========================================

/**
 * Makes HTTP requests to Paystack API
 * Handles authentication and request formatting
 * 
 * @param {string} endpoint - Paystack API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request payload (optional)
 * @returns {Promise<Object>} Paystack API response
 */
function makePaystackRequest(endpoint, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.paystack.co',
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`, // API authentication
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let responseData = '';
      
      // Collect response data
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      // Parse response when complete
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    // Handle request errors
    req.on('error', (error) => {
      reject(error);
    });
    
    // Send request data if provided
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// ========================================
// HOTEL MANAGEMENT API ROUTES
// ========================================

/**
 * Get All Hotels Endpoint
 * Retrieves list of all available hotels
 * 
 * @route GET /api/hotels
 * @returns {Object} Array of hotels with details
 */
app.get('/api/hotels', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    const hotels = await db.collection('hotels').find({}).toArray();
    res.json({ success: true, hotels });
  } catch (error) {
    console.error('Hotels error:', error);
    res.json({ success: false, message: 'Database error' });
  }
});

/**
 * Get Single Hotel Endpoint
 * Retrieves detailed information about a specific hotel
 * 
 * @route GET /api/hotels/:id
 * @param {string} id - Hotel ID
 * @returns {Object} Hotel details
 */
app.get('/api/hotels/:id', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    const hotel = await db.collection('hotels').findOne({ _id: new ObjectId(req.params.id) });
    if (!hotel) {
      return res.json({ success: false, message: 'Hotel not found' });
    }
    
    res.json({ success: true, hotel });
  } catch (error) {
    console.error('Hotel details error:', error);
    res.json({ success: false, message: 'Database error' });
  }
});

// ========================================
// CONTACT FORM API ROUTE
// ========================================

/**
 * Contact Form Submission Endpoint
 * Saves contact form messages to database
 * 
 * @route POST /api/contact
 * @param {string} name - Sender's name
 * @param {string} email - Sender's email
 * @param {string} subject - Message subject
 * @param {string} message - Message content
 * @returns {Object} Success/failure response
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  try {
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Create contact message record
    const contactMessage = {
      name,
      email,
      subject,
      message,
      created_at: new Date()
    };
    
    await db.collection('contacts').insertOne(contactMessage);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact error:', error);
    res.json({ success: false, message: 'Server error' });
  }
});

// ========================================
// DEALS AND OFFERS API ROUTE
// ========================================

/**
 * Get Active Deals Endpoint
 * Retrieves all currently active deals and promotions
 * 
 * @route GET /api/deals
 * @returns {Object} Array of active deals
 */
app.get('/api/deals', async (req, res) => {
  try {
    if (!db) {
      return res.json({ success: false, message: 'Database not connected' });
    }
    
    // Find only active deals
    const deals = await db.collection('deals').find({ active: true }).toArray();
    res.json({ success: true, deals });
  } catch (error) {
    console.error('Deals error:', error);
    res.json({ success: false, message: 'Database error' });
  }
});

// ========================================
// SERVER STARTUP
// ========================================

/**
 * Start the Express server
 * Listens on the configured port and logs startup message
 */
app.listen(PORT, () => {
  console.log('🚀 Fago\'s Booking Server Started');
  console.log(`📍 Server running on http://localhost:${PORT}`);
  console.log('📊 Available endpoints:');
  console.log('   - GET  /                    (Homepage)');
  console.log('   - GET  /hotels              (Hotels listing)');
  console.log('   - GET  /booking             (Booking page)');
  console.log('   - GET  /dashboard           (User dashboard)');
  console.log('   - POST /api/register        (User registration)');
  console.log('   - POST /api/login           (User login)');
  console.log('   - GET  /api/hotels          (Hotels API)');
  console.log('   - POST /api/payment/initialize (Payment)');
  console.log('   - GET  /api/test            (Database test)');
  console.log('');
  console.log('💡 Visit http://localhost:' + PORT + ' to access the application');
});