# Backend Modular Structure

The server.js file has been split into smaller, focused components for better maintainability and debugging.

## 📁 Directory Structure

```
backend/
├── server.js              # Main entry point - orchestrates all components
├── database.js            # Database connection (existing)
├── config/                # Configuration files
│   ├── app.js             # Express app setup and middleware configuration
│   └── constants.js       # Application constants and environment variables
├── middleware/            # Custom middleware functions
│   └── auth.js            # Authentication middleware for route protection
├── routes/                # Route handlers organized by functionality
│   ├── pages.js           # HTML page serving routes
│   ├── auth.js            # User authentication routes
│   ├── bookings.js        # Booking management routes
│   ├── payments.js        # Payment processing routes
│   └── api.js             # General API routes (hotels, deals, contact, health)
└── utils/                 # Utility functions
    └── paystack.js        # Paystack payment gateway utilities
```

## 🔧 Component Breakdown

### **server.js** (Main Entry Point)
- **Purpose**: Orchestrates application startup
- **Key Functions**:
  - `initializeDatabase()` - Connects to MongoDB
  - `configureMiddleware()` - Sets up Express middleware
  - `configureRoutes()` - Registers all route handlers
  - `startServer()` - Starts HTTP server
  - `initializeApplication()` - Coordinates startup sequence

### **config/app.js** (Application Configuration)
- **Purpose**: Express app setup and middleware configuration
- **Key Functions**:
  - `setupMiddleware()` - Configures CORS, JSON parsing, sessions, static files
- **Middleware Configured**:
  - CORS for API access
  - JSON and URL-encoded body parsing
  - Static file serving from frontend directory
  - Session management with secure cookies

### **config/constants.js** (Application Constants)
- **Purpose**: Centralized configuration values
- **Contains**:
  - Server port configuration
  - Paystack API credentials
  - Database collection names
  - User roles and status constants
  - Payment and booking status enums

### **middleware/auth.js** (Authentication Middleware)
- **Purpose**: Route protection and user verification
- **Functions**:
  - `requireAuth()` - Ensures user is logged in
  - `requireAdmin()` - Ensures user has admin privileges
  - `optionalAuth()` - Adds user info if available

### **routes/pages.js** (HTML Page Routes)
- **Purpose**: Serves static HTML pages
- **Routes**: `/`, `/hotels`, `/hotel/:id`, `/booking`, `/dashboard`, `/contact`, `/deals`, `/about`, `/login`
- **Function**: Each route serves corresponding HTML file from frontend/pages/

### **routes/auth.js** (Authentication Routes)
- **Purpose**: User registration, login, and session management
- **Routes**:
  - `POST /api/register` - User registration with password hashing
  - `POST /api/login` - User authentication and session creation
  - `GET /api/user` - Current user session information
  - `POST /api/logout` - Session destruction
- **Security**: Passwords hashed with bcrypt, secure session management

### **routes/bookings.js** (Booking Management)
- **Purpose**: Handle user booking operations
- **Routes**:
  - `GET /api/bookings` - List user's bookings
  - `GET /api/bookings/:id` - Get specific booking details
  - `POST /api/bookings/:id/cancel` - Cancel booking (with validation)
- **Security**: All routes protected with `requireAuth` middleware

### **routes/payments.js** (Payment Processing)
- **Purpose**: Handle Paystack payment integration
- **Routes**:
  - `POST /api/payment/initialize` - Start payment process
  - `GET /api/payment/verify` - Verify payment and create booking
- **Features**: 
  - Amount conversion (Naira to Kobo)
  - Metadata handling for booking information
  - Automatic booking creation on successful payment

### **routes/api.js** (General API Routes)
- **Purpose**: Handle general data operations
- **Routes**:
  - `GET /api/hotels` - List all hotels
  - `GET /api/hotels/:id` - Get hotel details
  - `POST /api/contact` - Submit contact form
  - `GET /api/deals` - Get active deals
  - `GET /api/test` - Database connection test
  - `GET /api/health` - Application health check

### **utils/paystack.js** (Payment Utilities)
- **Purpose**: Paystack API integration utilities
- **Functions**:
  - `makePaystackRequest()` - Generic Paystack API caller
  - `initializePayment()` - Initialize payment transaction
  - `verifyPayment()` - Verify payment status
- **Features**: HTTPS request handling, error management, JSON parsing

## 🚀 Benefits of Modular Structure

1. **Maintainability**: Each file has a single responsibility
2. **Debugging**: Easier to locate and fix issues in specific modules
3. **Scalability**: Easy to add new features without affecting existing code
4. **Testing**: Individual components can be tested in isolation
5. **Code Reuse**: Utilities and middleware can be shared across routes
6. **Team Development**: Multiple developers can work on different modules

## 🔄 How Components Work Together

1. **server.js** imports all modules and orchestrates startup
2. **config/app.js** sets up Express with middleware
3. **routes/** modules handle specific functionality
4. **middleware/auth.js** protects routes requiring authentication
5. **utils/paystack.js** handles payment processing
6. **config/constants.js** provides shared configuration

## 📝 Code Comments

Every file includes detailed line-by-line comments explaining:
- What each function does
- Why specific approaches were chosen
- How data flows through the system
- Security considerations
- Error handling strategies

This modular structure makes the codebase much easier to understand, maintain, and extend.