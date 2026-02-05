// Application configuration constants

// Server port - uses environment variable or defaults to 3001
const PORT = process.env.PORT || 3001;

// Paystack payment gateway secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Environment mode
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!PAYSTACK_SECRET_KEY) {
  console.error('❌ PAYSTACK_SECRET_KEY not found in environment variables');
}
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
}

// API endpoints configuration
const API_ENDPOINTS = {
  PAYSTACK_BASE_URL: 'api.paystack.co',
  TRANSACTION_INITIALIZE: '/transaction/initialize',
  TRANSACTION_VERIFY: '/transaction/verify'
};

// Database collections names
const COLLECTIONS = {
  USERS: 'users',
  BOOKINGS: 'bookings',
  PAYMENTS: 'payments',
  HOTELS: 'hotels',
  CONTACTS: 'contacts',
  DEALS: 'deals'
};

// User roles
const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

// Payment status constants
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Booking status constants
const BOOKING_STATUS = {
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed'
};

module.exports = {
  PORT,
  PAYSTACK_SECRET_KEY,
  MONGODB_URI,
  NODE_ENV,
  API_ENDPOINTS,
  COLLECTIONS,
  USER_ROLES,
  PAYMENT_STATUS,
  BOOKING_STATUS
};