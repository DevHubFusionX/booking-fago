# 📚 FAGO'S BOOKING - COMPLETE DOCUMENTATION

## 🏗️ PROJECT ARCHITECTURE

### **Backend (Node.js/Express)**
- **File**: `backend/server.js`
- **Purpose**: Main server application handling API requests, database operations, and payment processing
- **Key Features**:
  - MongoDB Atlas integration
  - Paystack payment gateway
  - User authentication with sessions
  - RESTful API endpoints
  - Static file serving

### **Frontend (HTML/CSS/JavaScript)**
- **Structure**: Component-based architecture with reusable elements
- **Pages**: Responsive design with mobile-first approach
- **Styling**: Modern CSS with animations and glassmorphism effects

### **Database (MongoDB Atlas)**
- **Collections**: users, hotels, bookings, payments, contacts, deals
- **Schema**: Structured document design with proper relationships

---

## 📁 FILE STRUCTURE & DOCUMENTATION

### **Backend Files**

#### `backend/server.js` - Main Server Application
```javascript
/**
 * MAIN SERVER FILE
 * - Handles all API endpoints
 * - Manages database connections
 * - Processes payments via Paystack
 * - Serves static frontend files
 * - Manages user authentication
 */
```

**Key Functions:**
- `connectToMongoDB()` - Establishes database connection with fallback options
- `makePaystackRequest()` - Handles Paystack API communication
- Authentication routes: `/api/register`, `/api/login`, `/api/logout`
- Payment routes: `/api/payment/initialize`, `/api/payment/verify`
- Data routes: `/api/hotels`, `/api/bookings`, `/api/deals`

#### `backend/db.json` - Local Database Fallback
```json
/**
 * LOCAL DATABASE BACKUP
 * - Contains sample data for development
 * - Used when MongoDB connection fails
 * - Includes hotels, deals, and user data
 */
```

### **Frontend Files**

#### `frontend/pages/index.html` - Homepage
```html
<!--
  HOMEPAGE - Main landing page
  Features:
  - Hero section with search functionality
  - Featured hotels carousel
  - Deals and promotions
  - Testimonials slider
  - Newsletter signup
  - Animated elements with AOS library
-->
```

#### `frontend/pages/auth.html` - Authentication Page
```html
<!--
  AUTHENTICATION PAGE
  Features:
  - Two-column layout (branding + forms)
  - Login and registration forms
  - Form validation
  - Password strength indicators
  - Responsive design
-->
```

#### `frontend/pages/hotels.html` - Hotels Listing
```html
<!--
  HOTELS LISTING PAGE
  Features:
  - Search and filter sidebar
  - Hotel cards grid layout
  - Sorting options (price, rating)
  - Pagination controls
  - Mobile-responsive filters
-->
```

#### `frontend/pages/hotel-details.html` - Hotel Details
```html
<!--
  HOTEL DETAILS PAGE
  Features:
  - Image gallery with lightbox
  - Booking form with date picker
  - Amenities grid display
  - Room types and pricing
  - Reviews and ratings
-->
```

#### `frontend/pages/booking.html` - Booking Process
```html
<!--
  BOOKING PROCESS PAGE
  Features:
  - Multi-step form (Guest Details → Payment → Confirmation)
  - Paystack payment integration
  - Booking summary sidebar
  - Form validation
  - Payment status handling
-->
```

#### `frontend/pages/dashboard.html` - User Dashboard
```html
<!--
  USER DASHBOARD
  Features:
  - Sidebar navigation
  - Bookings management (upcoming, past, cancelled)
  - Profile settings form
  - Favorite hotels grid
  - Booking status filters
-->
```

#### `frontend/pages/deals.html` - Deals & Offers
```html
<!--
  DEALS PAGE
  Features:
  - Hero section with countdown timer
  - Deals carousel
  - Promotional grid layout
  - Newsletter signup
  - Special offer badges
-->
```

#### `frontend/pages/contact.html` - Contact Page
```html
<!--
  CONTACT PAGE
  Features:
  - Contact form with validation
  - Company information
  - FAQ accordion
  - Social media links
  - Google Maps integration (placeholder)
-->
```

#### `frontend/pages/about.html` - About Page
```html
<!--
  ABOUT PAGE
  Features:
  - Company story section
  - Team member cards
  - Values and mission
  - Statistics counters
  - Call-to-action sections
-->
```

### **CSS Files**

#### `frontend/public/css/style.css` - Main Stylesheet
```css
/**
 * MAIN STYLESHEET
 * - Global styles and variables
 * - Component styles (navbar, buttons, forms)
 * - Responsive breakpoints
 * - Utility classes
 * - Animation definitions
 */
```

#### `frontend/public/css/homepage-animations.css` - Animation Styles
```css
/**
 * HOMEPAGE ANIMATIONS
 * - AOS (Animate On Scroll) integration
 * - Keyframe animations
 * - Hover effects
 * - Testimonials slider
 * - Mobile-responsive animations
 */
```

#### `frontend/public/css/booking.css` - Booking Page Styles
```css
/**
 * BOOKING PAGE STYLES
 * - Multi-step form styling
 * - Payment UI components
 * - Booking summary card
 * - Progress indicators
 * - Mobile-responsive layout
 */
```

#### `frontend/public/css/dashboard.css` - Dashboard Styles
```css
/**
 * DASHBOARD STYLES
 * - Sidebar navigation
 * - Booking cards layout
 * - Profile form styling
 * - Status badges
 * - Responsive grid system
 */
```

#### `frontend/public/css/auth-navbar.css` - Authentication Navbar
```css
/**
 * AUTHENTICATION-AWARE NAVBAR
 * - Dynamic navigation based on login status
 * - User menu dropdown
 * - Mobile sidebar navigation
 * - Login/logout state management
 */
```

### **JavaScript Files**

#### `frontend/components/header.js` - Header Component
```javascript
/**
 * REUSABLE HEADER COMPONENT
 * Functions:
 * - initMobileMenu() - Mobile navigation setup
 * - createMobileSidebar() - Dynamic sidebar creation
 * - openSidebar() / closeSidebar() - Mobile menu controls
 * - Responsive navigation handling
 */
```

#### `frontend/components/hotel-card.js` - Hotel Card Component
```javascript
/**
 * HOTEL CARD COMPONENT
 * Functions:
 * - createHotelCard() - Generate hotel card HTML
 * - Sample hotel data for development
 * - Rating stars generation
 * - Price formatting utilities
 */
```

#### `frontend/public/js/auth-navbar.js` - Authentication Navbar
```javascript
/**
 * AUTHENTICATION NAVBAR HANDLER
 * Functions:
 * - updateNavbarAuth() - Update navbar based on login status
 * - checkUserStatus() - Verify user authentication
 * - handleLogout() - Process user logout
 * - Dynamic menu generation
 */
```

### **Configuration Files**

#### `package.json` - Project Dependencies
```json
{
  "dependencies": {
    "express": "Web framework",
    "mongodb": "Database driver", 
    "bcryptjs": "Password hashing",
    "express-session": "Session management",
    "paystack": "Payment processing",
    "dotenv": "Environment variables"
  }
}
```

#### `.env` - Environment Variables
```env
# PAYSTACK CONFIGURATION
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key

# SERVER CONFIGURATION  
PORT=3001
SESSION_SECRET=fagos-booking-secret
```

---

## 🔄 DATA FLOW ARCHITECTURE

### **User Registration Flow**
1. User fills registration form (`auth.html`)
2. Frontend sends POST to `/api/register`
3. Server validates and hashes password
4. User data saved to MongoDB `users` collection
5. Success response sent to frontend

### **Authentication Flow**
1. User submits login form
2. Server verifies credentials against database
3. Session created with user data
4. Frontend updates navbar state
5. User redirected to dashboard

### **Booking & Payment Flow**
1. User selects hotel and dates
2. Guest details form submitted
3. Payment initialized with Paystack API
4. User redirected to Paystack checkout
5. Payment verified via webhook
6. Booking saved to database
7. Confirmation page displayed

### **Database Schema**

#### Users Collection
```javascript
{
  _id: ObjectId,
  first_name: String,
  last_name: String, 
  email: String,
  phone: String,
  password_hash: String,
  role: String, // 'customer' | 'admin'
  created_at: Date,
  updated_at: Date
}
```

#### Hotels Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  description: String,
  rooms: [{
    room_type: String,
    price_per_night: Number,
    capacity: Number,
    available: Boolean
  }],
  amenities: [String],
  images: [String],
  rating: Number,
  created_at: Date
}
```

#### Bookings Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId, // Reference to users
  hotel_id: ObjectId, // Reference to hotels
  room_type: String,
  check_in: String,
  check_out: String,
  guests: Number,
  total_amount: Number,
  payment_status: String, // 'pending' | 'paid' | 'failed'
  transaction_reference: String,
  created_at: Date,
  updated_at: Date
}
```

#### Payments Collection
```javascript
{
  _id: ObjectId,
  booking_id: ObjectId, // Reference to bookings
  user_id: ObjectId, // Reference to users
  amount: Number,
  currency: String,
  status: String, // 'success' | 'failed' | 'pending'
  transaction_reference: String,
  paystack_response: Object,
  created_at: Date
}
```

---

## 🚀 DEPLOYMENT GUIDE

### **Local Development**
```bash
# Install dependencies
npm install

# Set environment variables in .env file
PAYSTACK_SECRET_KEY=your_secret_key

# Start development server
npm run dev

# Access application
http://localhost:3001
```

### **Production Deployment**
1. Set up MongoDB Atlas cluster
2. Configure Paystack account
3. Set production environment variables
4. Deploy to hosting platform (Heroku, Vercel, etc.)
5. Update callback URLs in Paystack dashboard

---

## 🔧 MAINTENANCE & TROUBLESHOOTING

### **Common Issues**

#### MongoDB Connection Errors
- Check connection string format
- Verify network access in Atlas
- Ensure IP whitelist includes server IP

#### Paystack Payment Issues  
- Verify secret key in environment
- Check callback URL configuration
- Monitor Paystack dashboard for errors

#### Session Management
- Ensure session secret is set
- Check session middleware configuration
- Verify cookie settings for production

### **Performance Optimization**
- Implement database indexing
- Add caching layer (Redis)
- Optimize image loading
- Minify CSS/JavaScript files
- Enable gzip compression

---

## 📞 SUPPORT & CONTACT

For technical support or questions about this codebase:
- Review this documentation first
- Check console logs for error messages
- Verify environment configuration
- Test API endpoints individually

**Development Team**: Fago's Booking
**Version**: 1.0.0
**Last Updated**: December 2024