# 🔧 JAVASCRIPT DOCUMENTATION - FAGO'S BOOKING

## 📋 OVERVIEW

This document provides comprehensive documentation for all JavaScript files in the Fago's Booking frontend application. Each file is thoroughly documented with function explanations, usage examples, and integration guidelines.

---

## 📁 JAVASCRIPT FILE STRUCTURE

```
frontend/
├── components/
│   ├── header.js                    # Navigation component
│   ├── header-documented.js         # Fully documented version
│   ├── hotel-card.js               # Hotel display components
│   └── hotel-card-documented.js    # Fully documented version
├── public/js/
│   ├── auth-navbar.js              # Authentication navbar handler
│   ├── auth-navbar-documented.js   # Fully documented version
│   ├── booking-utils.js            # Booking utility functions
│   ├── booking-utils-documented.js # Fully documented version
│   ├── lazy-loading.js             # Lazy loading system
│   └── lazy-loading-documented.js  # Fully documented version
└── pages/
    ├── [page].html                 # Inline JavaScript in pages
    └── [page]-documented.html      # Documented versions
```

---

## 🧩 COMPONENT DOCUMENTATION

### **1. Header Component (`header.js`)**

**Purpose**: Reusable navigation component with mobile menu functionality

**Key Functions:**
```javascript
/**
 * Initializes mobile menu functionality
 * Creates sidebar and sets up event listeners
 */
function initMobileMenu()

/**
 * Creates mobile sidebar HTML structure
 * Injects navigation elements into page
 */
function createMobileSidebar()

/**
 * Opens mobile sidebar menu
 * Adds active classes and prevents scrolling
 */
function openSidebar()

/**
 * Closes mobile sidebar menu
 * Removes active classes and restores scrolling
 */
function closeSidebar()
```

**Usage Example:**
```javascript
// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
});

// Manual control
openSidebar();  // Open menu
closeSidebar(); // Close menu
```

**Features:**
- ✅ Responsive mobile navigation
- ✅ Touch-friendly sidebar
- ✅ Keyboard accessibility (Escape key)
- ✅ Click outside to close
- ✅ Smooth animations
- ✅ Body scroll prevention

---

### **2. Hotel Card Component (`hotel-card.js`)**

**Purpose**: Reusable hotel display components for different layouts

**Key Functions:**
```javascript
/**
 * Creates compact hotel card for grid layouts
 * @param {Object} hotel - Hotel data object
 * @returns {string} HTML string for hotel card
 */
function createHotelCard(hotel)

/**
 * Creates detailed hotel card for list layouts
 * @param {Object} hotel - Hotel data object
 * @returns {string} HTML string for detailed card
 */
function createHotelListCard(hotel)

/**
 * Generates star rating HTML
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star icons HTML
 */
function createStars(rating)

/**
 * Maps amenity names to Font Awesome icons
 * @param {string} amenity - Amenity name
 * @returns {string} Icon class name
 */
function getAmenityIcon(amenity)

/**
 * Fetches hotels from API
 * @returns {Promise<Array>} Array of hotel objects
 */
async function fetchHotels()
```

**Usage Example:**
```javascript
// Fetch and display hotels
const hotels = await fetchHotels();
const hotelCards = hotels.map(hotel => createHotelCard(hotel));
document.getElementById('hotels-grid').innerHTML = hotelCards.join('');

// Create individual card
const hotel = { name: 'Grand Hotel', rating: 4.5, /* ... */ };
const cardHTML = createHotelCard(hotel);
```

**Features:**
- ✅ Grid and list layout support
- ✅ Star rating system with half-stars
- ✅ Amenity icon mapping
- ✅ Price formatting
- ✅ Lazy loading integration
- ✅ Error handling for missing data
- ✅ Click navigation to hotel details

---

### **3. Authentication Navbar (`auth-navbar.js`)**

**Purpose**: Dynamic navbar updates based on user authentication status

**Key Functions:**
```javascript
/**
 * Updates navbar based on authentication state
 * Fetches user data and updates UI
 */
async function updateNavbarAuth()

/**
 * Fetches current user data from API
 * Updates global user state
 */
async function fetchCurrentUser()

/**
 * Updates desktop navigation auth section
 * Shows user menu or login button
 */
function updateDesktopNavAuth()

/**
 * Updates mobile sidebar auth section
 * Shows user info or login button
 */
function updateMobileSidebarAuth()

/**
 * Handles user logout process
 * Calls API and updates UI
 */
async function handleLogout()
```

**Usage Example:**
```javascript
// Update navbar on page load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(updateNavbarAuth, 100);
});

// Manual logout
await handleLogout();

// Check authentication status
const isAuthenticated = isUserAuthenticated();
const currentUser = getCurrentUser();
```

**Features:**
- ✅ Dynamic user menu generation
- ✅ Logout functionality
- ✅ Desktop and mobile support
- ✅ Error handling
- ✅ Loading states
- ✅ Keyboard navigation
- ✅ Dropdown menu management

---

### **4. Booking Utilities (`booking-utils.js`)**

**Purpose**: Shared utility functions for booking process

**Key Functions:**
```javascript
/**
 * Validates guest details form data
 * @param {Object} guestDetails - Guest information
 * @throws {Error} Validation error
 */
BookingUtils.validateGuestDetails(guestDetails)

/**
 * Validates booking dates
 * @param {string} checkinDate - Check-in date
 * @param {string} checkoutDate - Check-out date
 * @throws {Error} Date validation error
 */
BookingUtils.validateBookingDates(checkinDate, checkoutDate)

/**
 * Formats price in Nigerian Naira
 * @param {number} amount - Amount to format
 * @param {boolean} includeSymbol - Include ₦ symbol
 * @returns {string} Formatted price
 */
BookingUtils.formatPrice(amount, includeSymbol)

/**
 * Shows error message to user
 * @param {string} message - Error message
 * @param {number} duration - Display duration
 */
BookingUtils.showError(message, duration)

/**
 * Shows success message to user
 * @param {string} message - Success message
 * @param {number} duration - Display duration
 */
BookingUtils.showSuccess(message, duration)
```

**Usage Example:**
```javascript
// Validate guest details
try {
  BookingUtils.validateGuestDetails({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+234123456789'
  });
} catch (error) {
  BookingUtils.showError(error.message);
}

// Format price
const formattedPrice = BookingUtils.formatPrice(45000); // "₦45,000"

// Show messages
BookingUtils.showSuccess('Booking confirmed!');
BookingUtils.showError('Payment failed. Please try again.');
```

**Features:**
- ✅ Form validation with detailed error messages
- ✅ Date validation and calculations
- ✅ Price formatting utilities
- ✅ User notification system
- ✅ Loading state management
- ✅ Session storage helpers
- ✅ XSS protection

---

### **5. Lazy Loading System (`lazy-loading.js`)**

**Purpose**: Performance optimization with lazy loading and skeleton animations

**Key Classes & Functions:**
```javascript
/**
 * Main lazy loading class
 * Manages image and content lazy loading
 */
class LazyLoader {
  constructor()
  init()
  setupImageLazyLoading()
  setupContentLazyLoading()
  loadImage(img)
  observeImages()
  observeContent()
  destroy()
}

/**
 * Shows skeleton loading placeholders
 * @param {HTMLElement} container - Container element
 * @param {string} skeletonType - Type of skeleton
 * @param {number} count - Number of skeletons
 */
function showSkeletons(container, skeletonType, count)

/**
 * Hides skeletons and shows content
 * @param {HTMLElement} container - Container element
 * @param {string} content - HTML content
 */
function hideSkeletons(container, content)

/**
 * Creates lazy-loaded image element
 * @param {string} src - Image source
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @returns {string} Image HTML
 */
function createLazyImage(src, alt, className)
```

**Usage Example:**
```javascript
// Show loading skeletons
showSkeletons(document.getElementById('hotels'), 'hotel-card', 4);

// Hide skeletons and show content
setTimeout(() => {
  hideSkeletons(container, actualContent);
}, 1000);

// Create lazy image
const imageHTML = createLazyImage(
  'https://example.com/image.jpg',
  'Hotel exterior',
  'hotel-image'
);

// Manual lazy loader control
const lazyLoader = new LazyLoader();
lazyLoader.observeImages();
lazyLoader.observeContent();
```

**Skeleton Types:**
- `hotel-card` - Compact hotel cards
- `hotel-list` - Detailed hotel listings
- `booking-card` - Booking history cards
- `deal-card` - Promotional deal cards
- `room-option` - Room selection cards

**Features:**
- ✅ Intersection Observer API
- ✅ Multiple skeleton templates
- ✅ Image lazy loading with fallbacks
- ✅ Content animation on scroll
- ✅ Performance monitoring
- ✅ Browser compatibility fallbacks
- ✅ CSS animation injection

---

## 📄 PAGE-SPECIFIC JAVASCRIPT

### **Homepage (`index.html`)**

**Key Functions:**
```javascript
/**
 * Loads featured hotels with skeleton animation
 */
async function loadHotels()

/**
 * Initializes search form with date validation
 */
function initSearchForm()

/**
 * Sets up testimonial slider with auto-rotation
 */
function initTestimonialSlider()

/**
 * Handles sticky navigation on scroll
 */
window.addEventListener('scroll', stickyNavHandler)
```

**Features:**
- Hotel loading with skeleton placeholders
- Search form date validation
- Testimonial slider with manual/auto controls
- Sticky navigation behavior
- AOS scroll animations
- Mobile menu integration

---

### **Booking Page (`booking.html`)**

**Key Functions:**
```javascript
/**
 * Navigates between booking steps
 * @param {number} step - Step number (1, 2, or 3)
 */
function nextStep(step)

/**
 * Initiates Paystack payment process
 */
async function initiatePayment()

/**
 * Checks payment status from URL parameters
 */
function checkPaymentStatus()

/**
 * Loads and manages booking data
 */
function loadBookingData()

/**
 * Updates booking summary display
 */
function updateBookingSummary()
```

**Features:**
- Multi-step form navigation
- Paystack payment integration
- Form validation and error handling
- Booking data management
- Price calculations
- Payment status handling

---

### **Dashboard Page (`dashboard.html`)**

**Key Functions:**
```javascript
/**
 * Initializes dashboard functionality
 */
function initDashboard()

/**
 * Loads user bookings from API
 */
async function loadUserBookings()

/**
 * Filters bookings by status
 * @param {string} status - Booking status filter
 */
function filterBookings(status)

/**
 * Updates user profile information
 */
async function updateProfile()
```

**Features:**
- Tab navigation between sections
- Booking history management
- Profile editing functionality
- Favorites management
- Booking status filtering

---

## 🔄 INTEGRATION PATTERNS

### **Component Communication**

**Event-Driven Architecture:**
```javascript
// Custom events for component communication
document.dispatchEvent(new CustomEvent('userLoggedIn', {
  detail: { user: userData }
}));

// Listen for events
document.addEventListener('userLoggedIn', (event) => {
  updateNavbarAuth();
  loadUserBookings();
});
```

**Global State Management:**
```javascript
// Global variables for shared state
window.currentUser = null;
window.bookingData = null;

// State update functions
function updateGlobalUser(user) {
  window.currentUser = user;
  localStorage.setItem('currentUser', JSON.stringify(user));
}
```

### **API Integration Pattern**

**Consistent API Calling:**
```javascript
/**
 * Generic API call function
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response
 */
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Usage across components
const hotels = await apiCall('/api/hotels');
const user = await apiCall('/api/user');
```

### **Error Handling Pattern**

**Consistent Error Management:**
```javascript
/**
 * Global error handler
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
function handleError(error, context = 'Unknown') {
  console.error(`Error in ${context}:`, error);
  
  // Show user-friendly message
  if (window.BookingUtils) {
    BookingUtils.showError(
      error.message || 'An unexpected error occurred'
    );
  }
  
  // Log to monitoring service (if available)
  if (window.errorLogger) {
    window.errorLogger.log(error, context);
  }
}

// Usage in components
try {
  await someAsyncOperation();
} catch (error) {
  handleError(error, 'Hotel Loading');
}
```

---

## 🎯 PERFORMANCE OPTIMIZATION

### **Code Splitting**

**Lazy Loading Components:**
```javascript
// Dynamic import for heavy components
async function loadHeavyComponent() {
  const { HeavyComponent } = await import('./heavy-component.js');
  return new HeavyComponent();
}

// Load only when needed
document.getElementById('load-component').addEventListener('click', async () => {
  const component = await loadHeavyComponent();
  component.render();
});
```

### **Debouncing and Throttling**

**Search Input Optimization:**
```javascript
/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage for search
const debouncedSearch = debounce(async (query) => {
  const results = await searchHotels(query);
  displayResults(results);
}, 300);

document.getElementById('search').addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});
```

### **Memory Management**

**Event Listener Cleanup:**
```javascript
class ComponentManager {
  constructor() {
    this.eventListeners = [];
  }
  
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }
  
  destroy() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
}
```

---

## 🧪 TESTING GUIDELINES

### **Unit Testing Example**

```javascript
// Test for booking utilities
describe('BookingUtils', () => {
  test('formatPrice should format Nigerian Naira correctly', () => {
    expect(BookingUtils.formatPrice(45000)).toBe('₦45,000');
    expect(BookingUtils.formatPrice(45000, false)).toBe('45,000');
  });
  
  test('validateGuestDetails should throw error for invalid email', () => {
    expect(() => {
      BookingUtils.validateGuestDetails({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: '+234123456789'
      });
    }).toThrow('Please enter a valid email address');
  });
});
```

### **Integration Testing**

```javascript
// Test component integration
describe('Hotel Card Integration', () => {
  test('should create hotel card and handle click', async () => {
    const hotel = { _id: 'hotel1', name: 'Test Hotel' };
    const cardHTML = createHotelCard(hotel);
    
    document.body.innerHTML = cardHTML;
    const card = document.querySelector('.hotel-card');
    
    // Simulate click
    card.click();
    
    // Check navigation
    expect(window.location.href).toContain('/hotel/hotel1');
  });
});
```

---

## 🔧 DEBUGGING TOOLS

### **Console Logging Standards**

```javascript
// Consistent logging format
const Logger = {
  info: (message, data = null) => {
    console.log(`ℹ️ ${message}`, data);
  },
  
  error: (message, error = null) => {
    console.error(`❌ ${message}`, error);
  },
  
  success: (message, data = null) => {
    console.log(`✅ ${message}`, data);
  },
  
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`🐛 ${message}`, data);
    }
  }
};
```

### **Performance Monitoring**

```javascript
// Performance measurement
function measurePerformance(name, fn) {
  return async function (...args) {
    performance.mark(`${name}-start`);
    const result = await fn.apply(this, args);
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`⚡ ${name}: ${measure.duration.toFixed(2)}ms`);
    
    return result;
  };
}

// Usage
const measuredFetchHotels = measurePerformance('fetchHotels', fetchHotels);
```

---

## 📚 BEST PRACTICES

### **Code Organization**

1. **Modular Structure**: Each file has a single responsibility
2. **Consistent Naming**: camelCase for functions, kebab-case for CSS
3. **Documentation**: Every function has JSDoc comments
4. **Error Handling**: Try-catch blocks with meaningful messages
5. **Performance**: Lazy loading and debouncing where appropriate

### **Security Considerations**

1. **XSS Prevention**: HTML escaping in utility functions
2. **Input Validation**: Client and server-side validation
3. **CSRF Protection**: Session-based authentication
4. **Content Security Policy**: Restricted script execution

### **Accessibility**

1. **Keyboard Navigation**: Tab order and escape key handling
2. **Screen Readers**: ARIA labels and semantic HTML
3. **Focus Management**: Proper focus trapping in modals
4. **Color Contrast**: Sufficient contrast ratios

---

This documentation provides a complete reference for all JavaScript functionality in the Fago's Booking application. Each component is designed to be maintainable, testable, and performant while following modern web development best practices.