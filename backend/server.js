// Main server file - Entry point for the booking application
// This file orchestrates all components and starts the server

// Import application configuration and setup
const { app, setupMiddleware } = require('./config/app');
const { PORT } = require('./config/constants');
const database = require('./database');

// Import route modules
const pagesRouter = require('./routes/pages');
const authRouter = require('./routes/auth');
const bookingsRouter = require('./routes/bookings');
const paymentsRouter = require('./routes/payments');
const apiRouter = require('./routes/api');

/**
 * Initialize database connection
 * Attempts to connect to MongoDB database on startup
 */
async function initializeDatabase() {
  console.log('🔌 Connecting to database...');
  const success = await database.connect();
  
  if (!success) {
    console.error('❌ Failed to connect to database. Server will continue but database operations will fail.');
  } else {
    console.log('✅ Database connected successfully');
  }
}

/**
 * Setup application middleware
 * Configures Express middleware for request processing
 */
function configureMiddleware() {
  console.log('⚙️  Setting up middleware...');
  setupMiddleware(app);
  console.log('✅ Middleware configured');
}

/**
 * Setup application routes
 * Registers all route handlers with their respective paths
 */
function configureRoutes() {
  console.log('🛣️  Setting up routes...');
  
  // Page routes - serve HTML files
  app.use('/', pagesRouter);
  
  // API routes - handle data operations
  app.use('/api', authRouter); // Authentication endpoints (/api/login, /api/register, etc.)
  app.use('/api/bookings', bookingsRouter); // Booking management endpoints
  app.use('/api/payment', paymentsRouter); // Payment processing endpoints
  app.use('/api', apiRouter); // General API endpoints (hotels, deals, contact, health)
  
  console.log('✅ Routes configured');
}

/**
 * Start the Express server
 * Begins listening for incoming HTTP requests
 */
function startServer() {
  app.listen(PORT, () => {
    console.log('\n🚀 ===== SERVER STARTED =====');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Database test: http://localhost:${PORT}/api/test`);
    console.log('================================\n');
  });
}

/**
 * Main application initialization function
 * Coordinates the startup sequence
 */
async function initializeApplication() {
  console.log('🏁 Starting Fago\'s Booking Server...\n');
  
  try {
    // Step 1: Initialize database connection
    await initializeDatabase();
    
    // Step 2: Configure Express middleware
    configureMiddleware();
    
    // Step 3: Setup application routes
    configureRoutes();
    
    // Step 4: Start the server
    startServer();
    
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1); // Exit with error code
  }
}

// Start the application
initializeApplication();