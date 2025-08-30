/**
 * UI HELPER FUNCTIONS - SHARED UTILITY FUNCTIONS
 * ==============================================
 * 
 * This module provides shared utility functions used across multiple pages
 * of the application. It includes common UI components and helper functions
 * that maintain consistency throughout the user interface.
 * 
 * Features:
 * - Amenity icon mapping for consistent iconography
 * - Star rating generation system
 * - Mobile navigation menu functionality
 * - Reusable UI components
 * - Cross-page utility functions
 * 
 * Usage:
 * These functions are automatically available on all pages that include
 * this script. They provide consistent behavior and styling across the
 * entire application.
 * 
 * Dependencies:
 * - Font Awesome icons for amenities and UI elements
 * - CSS classes for mobile sidebar and navigation
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// AMENITY ICON MAPPING
// ========================================

/**
 * Maps amenity names to Font Awesome icon classes
 * Provides consistent iconography across the application
 * 
 * This function ensures that all amenities display with appropriate
 * and recognizable icons throughout the hotel listings, details,
 * and booking pages.
 * 
 * @param {string} amenity - The name of the amenity
 * @returns {string} Font Awesome icon class name (without 'fa-' prefix)
 * 
 * @example
 * getAmenityIcon('Free WiFi') // Returns 'wifi'
 * getAmenityIcon('Swimming Pool') // Returns 'swimming-pool'
 * getAmenityIcon('Unknown Amenity') // Returns 'check' (fallback)
 */
function getAmenityIcon(amenity) {
  /**
   * Comprehensive mapping of amenity names to Font Awesome icons
   * Covers common hotel amenities with appropriate visual representations
   */
  const iconMap = {
    // Internet and Technology
    'Free WiFi': 'wifi',
    'WiFi': 'wifi',
    'High-Speed Internet': 'wifi',
    'Business Center': 'briefcase',
    
    // Recreation and Leisure
    'Swimming Pool': 'swimming-pool',
    'Pool': 'swimming-pool',
    'Outdoor Pool': 'swimming-pool',
    'Indoor Pool': 'swimming-pool',
    'Gym': 'dumbbell',
    'Fitness Center': 'dumbbell',
    'Spa': 'spa',
    'Sauna': 'hot-tub',
    'Beach Access': 'umbrella-beach',
    'Private Beach': 'umbrella-beach',
    
    // Dining and Food
    'Restaurant': 'utensils',
    'Bar': 'cocktail',
    'Room Service': 'concierge-bell',
    'Breakfast': 'coffee',
    'Free Breakfast': 'coffee',
    'Continental Breakfast': 'bread-slice',
    'Mini Bar': 'wine-glass',
    
    // Transportation and Parking
    'Parking': 'car',
    'Free Parking': 'car',
    'Valet Parking': 'car-side',
    'Airport Shuttle': 'shuttle-van',
    'Car Rental': 'car',
    
    // Room Amenities
    'Air Conditioning': 'snowflake',
    'Heating': 'thermometer-half',
    'Balcony': 'building',
    'Terrace': 'building',
    'Kitchen': 'utensils',
    'Kitchenette': 'utensils',
    'Refrigerator': 'snowflake',
    'Microwave': 'microwave',
    
    // Services
    'Laundry': 'tshirt',
    'Dry Cleaning': 'tshirt',
    'Concierge': 'concierge-bell',
    '24/7 Front Desk': 'clock',
    'Housekeeping': 'broom',
    
    // Entertainment
    'TV': 'tv',
    'Cable TV': 'tv',
    'Satellite TV': 'satellite',
    'Netflix': 'play',
    
    // Accessibility
    'Wheelchair Accessible': 'wheelchair',
    'Elevator': 'elevator',
    
    // Pet-Friendly
    'Pet Friendly': 'paw',
    'Pet Allowed': 'paw',
    
    // Safety and Security
    'Safe': 'lock',
    'Security': 'shield-alt',
    'CCTV': 'video'
  };
  
  // Return mapped icon or fallback to 'check' for unknown amenities
  return iconMap[amenity] || 'check';
}

// ========================================
// STAR RATING SYSTEM
// ========================================

/**
 * Creates HTML for star rating display
 * Generates a 5-star rating system with support for half stars
 * 
 * This function creates consistent star ratings across all hotel
 * displays, from listing cards to detailed hotel pages.
 * 
 * @param {number} rating - Rating value between 0 and 5
 * @returns {string} HTML string containing Font Awesome star icons
 * 
 * @example
 * createStars(4.5) // Returns HTML for 4 full stars and 1 half star
 * createStars(3.0) // Returns HTML for 3 full stars and 2 empty stars
 * createStars(0)   // Returns HTML for 5 empty stars
 */
function createStars(rating) {
  // Validate rating input
  if (typeof rating !== 'number' || rating < 0 || rating > 5) {
    console.warn('Invalid rating value:', rating);
    rating = 0; // Default to 0 stars for invalid input
  }
  
  // Calculate star distribution
  const fullStars = Math.floor(rating);           // Number of full stars
  const hasHalfStar = (rating % 1) >= 0.5;       // Whether to show half star
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0); // Remaining empty stars
  
  let starsHTML = '';\n  \n  // Add full stars\n  for (let i = 0; i < fullStars; i++) {\n    starsHTML += '<i class=\"fas fa-star\" title=\"Full star\"></i>';\n  }\n  \n  // Add half star if needed\n  if (hasHalfStar) {\n    starsHTML += '<i class=\"fas fa-star-half-alt\" title=\"Half star\"></i>';\n  }\n  \n  // Add empty stars to complete 5-star system\n  for (let i = 0; i < emptyStars; i++) {\n    starsHTML += '<i class=\"far fa-star\" title=\"Empty star\"></i>';\n  }\n  \n  return starsHTML;\n}\n\n// ========================================\n// MOBILE NAVIGATION SYSTEM\n// ========================================\n\n/**\n * Initializes mobile navigation menu\n * Sets up responsive navigation with sidebar functionality\n * \n * This function creates a mobile-friendly navigation system that\n * works across all pages of the application. It includes touch-friendly\n * interactions and proper accessibility features.\n * \n * Call this function on each page that needs mobile navigation.\n */\nfunction initMobileMenu() {\n  // Create the mobile sidebar HTML structure\n  createMobileSidebar();\n  \n  // Set up event listeners for menu interactions\n  setupMobileMenuEventListeners();\n  \n  console.log('📱 Mobile menu initialized');\n}\n\n/**\n * Creates the mobile sidebar HTML structure\n * Dynamically injects sidebar elements into the page\n * \n * The sidebar includes:\n * - Header with logo and close button\n * - Navigation links to main pages\n * - Authentication section (updated dynamically)\n * - Overlay for closing menu when clicking outside\n */\nfunction createMobileSidebar() {\n  // Check if sidebar already exists to prevent duplicates\n  if (document.querySelector('.mobile-sidebar')) {\n    console.warn('Mobile sidebar already exists');\n    return;\n  }\n  \n  /**\n   * Complete mobile sidebar HTML structure\n   * Includes all necessary elements for mobile navigation\n   */\n  const sidebarHTML = `\n    <!-- Overlay for closing menu when clicking outside -->\n    <div class=\"sidebar-overlay\" role=\"button\" aria-label=\"Close menu\"></div>\n    \n    <!-- Main sidebar container -->\n    <div class=\"mobile-sidebar\" role=\"navigation\" aria-label=\"Mobile navigation\">\n      <!-- Sidebar header with logo and close button -->\n      <div class=\"sidebar-header\">\n        <h3>FAGO</h3>\n        <button class=\"sidebar-close\" aria-label=\"Close navigation menu\">\n          <i class=\"fas fa-times\" aria-hidden=\"true\"></i>\n        </button>\n      </div>\n      \n      <!-- Main navigation links -->\n      <nav class=\"sidebar-nav\">\n        <a href=\"/\" class=\"nav-link\">\n          <i class=\"fas fa-home\" aria-hidden=\"true\"></i>\n          <span>Home</span>\n        </a>\n        <a href=\"/hotels\" class=\"nav-link\">\n          <i class=\"fas fa-building\" aria-hidden=\"true\"></i>\n          <span>Hotels</span>\n        </a>\n        <a href=\"/deals\" class=\"nav-link\">\n          <i class=\"fas fa-tags\" aria-hidden=\"true\"></i>\n          <span>Deals</span>\n        </a>\n        <a href=\"/about\" class=\"nav-link\">\n          <i class=\"fas fa-info-circle\" aria-hidden=\"true\"></i>\n          <span>About</span>\n        </a>\n        <a href=\"/contact\" class=\"nav-link\">\n          <i class=\"fas fa-envelope\" aria-hidden=\"true\"></i>\n          <span>Contact</span>\n        </a>\n      </nav>\n      \n      <!-- Authentication section (updated dynamically by auth-navbar.js) -->\n      <div class=\"sidebar-auth\">\n        <a href=\"/login\" class=\"login-btn\">\n          <i class=\"fas fa-sign-in-alt\" aria-hidden=\"true\"></i>\n          <span>Login / Sign Up</span>\n        </a>\n      </div>\n    </div>\n  `;\n  \n  // Inject sidebar HTML into the page body\n  document.body.insertAdjacentHTML('beforeend', sidebarHTML);\n}\n\n/**\n * Sets up event listeners for mobile menu interactions\n * Handles opening, closing, and accessibility features\n */\nfunction setupMobileMenuEventListeners() {\n  // Get menu elements\n  const mobileMenuButton = document.getElementById('mobile-menu');\n  const sidebarCloseButton = document.querySelector('.sidebar-close');\n  const sidebarOverlay = document.querySelector('.sidebar-overlay');\n  \n  // Mobile menu button click handler\n  if (mobileMenuButton) {\n    mobileMenuButton.addEventListener('click', (e) => {\n      e.preventDefault();\n      openSidebar();\n    });\n  } else {\n    console.warn('Mobile menu button not found');\n  }\n  \n  // Sidebar close button click handler\n  if (sidebarCloseButton) {\n    sidebarCloseButton.addEventListener('click', (e) => {\n      e.preventDefault();\n      closeSidebar();\n    });\n  }\n  \n  // Overlay click handler (close menu when clicking outside)\n  if (sidebarOverlay) {\n    sidebarOverlay.addEventListener('click', closeSidebar);\n  }\n  \n  // Keyboard accessibility - close menu with Escape key\n  document.addEventListener('keydown', (e) => {\n    if (e.key === 'Escape' && isSidebarOpen()) {\n      closeSidebar();\n    }\n  });\n  \n  // Close sidebar when window is resized to desktop size\n  window.addEventListener('resize', () => {\n    if (window.innerWidth > 768 && isSidebarOpen()) {\n      closeSidebar();\n    }\n  });\n}\n\n/**\n * Opens the mobile sidebar menu\n * Adds active classes and prevents body scrolling\n * \n * Actions performed:\n * - Shows overlay with fade-in effect\n * - Slides in sidebar from the right\n * - Prevents background scrolling\n * - Sets focus for accessibility\n */\nfunction openSidebar() {\n  const overlay = document.querySelector('.sidebar-overlay');\n  const sidebar = document.querySelector('.mobile-sidebar');\n  \n  if (!overlay || !sidebar) {\n    console.error('Sidebar elements not found');\n    return;\n  }\n  \n  // Add active classes to trigger CSS animations\n  overlay.classList.add('active');\n  sidebar.classList.add('active');\n  \n  // Prevent background scrolling while menu is open\n  document.body.style.overflow = 'hidden';\n  document.body.classList.add('sidebar-open');\n  \n  // Set focus to first navigation link for accessibility\n  const firstNavLink = sidebar.querySelector('.nav-link');\n  if (firstNavLink) {\n    setTimeout(() => firstNavLink.focus(), 100);\n  }\n  \n  console.log('📱 Mobile sidebar opened');\n}\n\n/**\n * Closes the mobile sidebar menu\n * Removes active classes and restores body scrolling\n * \n * Actions performed:\n * - Hides overlay with fade-out effect\n * - Slides out sidebar to the right\n * - Restores background scrolling\n * - Returns focus to menu button\n */\nfunction closeSidebar() {\n  const overlay = document.querySelector('.sidebar-overlay');\n  const sidebar = document.querySelector('.mobile-sidebar');\n  const menuButton = document.getElementById('mobile-menu');\n  \n  if (!overlay || !sidebar) {\n    return; // Sidebar not initialized\n  }\n  \n  // Remove active classes to trigger CSS close animations\n  overlay.classList.remove('active');\n  sidebar.classList.remove('active');\n  \n  // Restore background scrolling\n  document.body.style.overflow = '';\n  document.body.classList.remove('sidebar-open');\n  \n  // Return focus to menu button for accessibility\n  if (menuButton) {\n    menuButton.focus();\n  }\n  \n  console.log('📱 Mobile sidebar closed');\n}\n\n// ========================================\n// UTILITY FUNCTIONS\n// ========================================\n\n/**\n * Checks if the mobile sidebar is currently open\n * \n * @returns {boolean} True if sidebar is open, false otherwise\n */\nfunction isSidebarOpen() {\n  const sidebar = document.querySelector('.mobile-sidebar');\n  return sidebar && sidebar.classList.contains('active');\n}\n\n/**\n * Toggles the mobile sidebar (open if closed, close if open)\n * Alternative to separate open/close functions\n */\nfunction toggleSidebar() {\n  if (isSidebarOpen()) {\n    closeSidebar();\n  } else {\n    openSidebar();\n  }\n}\n\n/**\n * Highlights the current page in navigation\n * Adds active class to current page link\n * \n * @param {string} currentPath - Current page path\n */\nfunction highlightCurrentPage(currentPath = window.location.pathname) {\n  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link, .nav-links a');\n  \n  navLinks.forEach(link => {\n    const linkPath = new URL(link.href).pathname;\n    link.classList.toggle('active', linkPath === currentPath);\n  });\n}\n\n// ========================================\n// ADDITIONAL UI HELPERS\n// ========================================\n\n/**\n * Formats currency amounts consistently\n * \n * @param {number} amount - Amount to format\n * @param {string} currency - Currency symbol (default: '₦')\n * @returns {string} Formatted currency string\n */\nfunction formatCurrency(amount, currency = '₦') {\n  if (typeof amount !== 'number' || isNaN(amount)) {\n    return `${currency}0`;\n  }\n  \n  return `${currency}${amount.toLocaleString()}`;\n}\n\n/**\n * Creates a loading spinner element\n * \n * @param {string} size - Size class ('small', 'medium', 'large')\n * @returns {string} HTML string for loading spinner\n */\nfunction createLoadingSpinner(size = 'medium') {\n  return `\n    <div class=\"loading-spinner ${size}\">\n      <i class=\"fas fa-spinner fa-spin\" aria-hidden=\"true\"></i>\n      <span class=\"sr-only\">Loading...</span>\n    </div>\n  `;\n}\n\n/**\n * Smoothly scrolls to an element\n * \n * @param {string|HTMLElement} target - Element selector or element\n * @param {number} offset - Offset from top in pixels\n */\nfunction scrollToElement(target, offset = 0) {\n  const element = typeof target === 'string' ? document.querySelector(target) : target;\n  \n  if (element) {\n    const elementPosition = element.offsetTop - offset;\n    window.scrollTo({\n      top: elementPosition,\n      behavior: 'smooth'\n    });\n  }\n}\n\n// ========================================\n// INITIALIZATION\n// ========================================\n\n/**\n * Initialize UI helpers when DOM is ready\n * Sets up common functionality across all pages\n */\ndocument.addEventListener('DOMContentLoaded', () => {\n  // Highlight current page in navigation\n  highlightCurrentPage();\n  \n  // Add smooth scrolling to anchor links\n  document.querySelectorAll('a[href^=\"#\"]').forEach(anchor => {\n    anchor.addEventListener('click', function (e) {\n      e.preventDefault();\n      const target = document.querySelector(this.getAttribute('href'));\n      if (target) {\n        scrollToElement(target, 80); // 80px offset for fixed header\n      }\n    });\n  });\n  \n  console.log('🎨 UI helpers initialized');\n});\n\n// ========================================\n// EXPORT FOR MODULE SYSTEMS (if needed)\n// ========================================\n\n// If using module system, export the main functions\nif (typeof module !== 'undefined' && module.exports) {\n  module.exports = {\n    getAmenityIcon,\n    createStars,\n    initMobileMenu,\n    openSidebar,\n    closeSidebar,\n    toggleSidebar,\n    isSidebarOpen,\n    highlightCurrentPage,\n    formatCurrency,\n    createLoadingSpinner,\n    scrollToElement\n  };\n}"