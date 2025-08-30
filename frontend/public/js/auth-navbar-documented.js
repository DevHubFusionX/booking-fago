/**
 * AUTHENTICATION-AWARE NAVBAR HANDLER
 * ===================================
 * 
 * This script manages the navigation bar's authentication state across all pages.
 * It dynamically updates the navbar based on whether a user is logged in or not.
 * 
 * Features:
 * - Dynamic navbar updates based on login status
 * - User menu with logout functionality
 * - Consistent authentication state across pages
 * - Mobile-responsive authentication UI
 * - Session management integration
 * 
 * Usage:
 * Include this script on pages that need authentication-aware navigation
 * Call updateNavbarAuth() after page load or authentication state changes
 * 
 * Dependencies:
 * - Server API endpoints: /api/user, /api/logout
 * - CSS classes for authentication states
 * - Font Awesome icons for user interface
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// GLOBAL VARIABLES
// ========================================

/**
 * Stores the current user's information
 * Updated when authentication state changes
 * @type {Object|null}
 */
let currentUser = null;

/**
 * Cache for DOM elements to avoid repeated queries
 * @type {Object}
 */
const domCache = {
  navAuth: null,
  sidebarAuth: null,
  userMenus: []
};

// ========================================
// MAIN AUTHENTICATION UPDATE FUNCTION
// ========================================

/**
 * Updates the navbar authentication state
 * This is the main function that should be called to refresh the navbar
 * 
 * Process:
 * 1. Fetches current user data from server
 * 2. Updates desktop navbar authentication section
 * 3. Updates mobile sidebar authentication section
 * 4. Sets up event listeners for user interactions
 * 
 * @returns {Promise<void>}
 */
async function updateNavbarAuth() {
  try {
    // Fetch current user data from server
    await fetchCurrentUser();
    
    // Update both desktop and mobile navigation
    updateDesktopNavAuth();
    updateMobileSidebarAuth();
    
    // Set up event listeners for user interactions
    setupAuthEventListeners();
    
  } catch (error) {
    console.error('Error updating navbar authentication:', error);
    // Fallback to logged-out state on error
    handleLoggedOutState();
  }
}

// ========================================
// USER DATA FETCHING
// ========================================

/**
 * Fetches the current user's data from the server
 * Updates the global currentUser variable
 * 
 * Makes API call to /api/user endpoint to check authentication status
 * Handles both authenticated and unauthenticated states
 * 
 * @returns {Promise<void>}
 */
async function fetchCurrentUser() {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      credentials: 'include', // Include session cookies
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Update global user state
    currentUser = data.user;
    
    // Log authentication status for debugging
    if (currentUser) {
      console.log('✅ User authenticated:', currentUser.name);
    } else {
      console.log('❌ User not authenticated');
    }
    
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    currentUser = null; // Ensure logged-out state on error
  }
}

// ========================================
// DESKTOP NAVBAR UPDATES
// ========================================

/**
 * Updates the desktop navigation bar authentication section
 * 
 * Shows different content based on authentication state:
 * - Logged in: User menu with name and logout option
 * - Logged out: Login/Sign Up button
 * 
 * @returns {void}
 */
function updateDesktopNavAuth() {
  // Get or cache the desktop nav auth element
  if (!domCache.navAuth) {
    domCache.navAuth = document.querySelector('.nav-auth');
  }
  
  const navAuth = domCache.navAuth;
  if (!navAuth) {
    console.warn('Desktop nav-auth element not found');
    return;
  }
  
  if (currentUser) {
    // User is logged in - show user menu
    navAuth.innerHTML = createLoggedInNavHTML(currentUser);
  } else {
    // User is logged out - show login button
    navAuth.innerHTML = createLoggedOutNavHTML();
  }
}

/**
 * Creates HTML for logged-in user navigation
 * 
 * @param {Object} user - User object with name and email
 * @returns {string} HTML string for logged-in navigation
 */
function createLoggedInNavHTML(user) {
  return `
    <div class="user-menu">
      <!-- User greeting and dropdown trigger -->
      <button class="user-menu-trigger" aria-expanded="false" aria-haspopup="true">
        <i class="fas fa-user-circle"></i>
        <span class="user-name">${escapeHtml(user.name)}</span>
        <i class="fas fa-chevron-down dropdown-arrow"></i>
      </button>
      
      <!-- Dropdown menu -->
      <div class="user-dropdown" role="menu">
        <a href="/dashboard" class="dropdown-item" role="menuitem">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
        <a href="/dashboard" class="dropdown-item" role="menuitem">
          <i class="fas fa-calendar-check"></i>
          <span>My Bookings</span>
        </a>
        <a href="/dashboard" class="dropdown-item" role="menuitem">
          <i class="fas fa-user-cog"></i>
          <span>Profile Settings</span>
        </a>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item logout-btn" role="menuitem">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Creates HTML for logged-out user navigation
 * 
 * @returns {string} HTML string for logged-out navigation
 */
function createLoggedOutNavHTML() {
  return `
    <a href="/login" class="login-btn">
      <i class="fas fa-sign-in-alt"></i>
      <span>Login / Sign Up</span>
    </a>
  `;
}

// ========================================
// MOBILE SIDEBAR UPDATES
// ========================================

/**
 * Updates the mobile sidebar authentication section
 * 
 * Similar to desktop navbar but optimized for mobile layout
 * Updates the .sidebar-auth element if it exists
 * 
 * @returns {void}
 */
function updateMobileSidebarAuth() {
  // Get or cache the mobile sidebar auth element
  if (!domCache.sidebarAuth) {
    domCache.sidebarAuth = document.querySelector('.sidebar-auth');
  }
  
  const sidebarAuth = domCache.sidebarAuth;
  if (!sidebarAuth) {
    // Sidebar might not exist on all pages
    return;
  }
  
  if (currentUser) {
    // User is logged in - show user info and logout
    sidebarAuth.innerHTML = createLoggedInSidebarHTML(currentUser);
  } else {
    // User is logged out - show login button
    sidebarAuth.innerHTML = createLoggedOutSidebarHTML();
  }
}

/**
 * Creates HTML for logged-in user mobile sidebar
 * 
 * @param {Object} user - User object with name and email
 * @returns {string} HTML string for logged-in mobile sidebar
 */
function createLoggedInSidebarHTML(user) {
  return `
    <div class="sidebar-user-info">
      <div class="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-details">
        <span class="user-name">${escapeHtml(user.name)}</span>
        <span class="user-email">${escapeHtml(user.email)}</span>
      </div>
    </div>
    <div class="sidebar-user-actions">
      <a href="/dashboard" class="sidebar-btn">
        <i class="fas fa-tachometer-alt"></i>
        <span>Dashboard</span>
      </a>
      <button class="sidebar-btn logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  `;
}

/**
 * Creates HTML for logged-out user mobile sidebar
 * 
 * @returns {string} HTML string for logged-out mobile sidebar
 */
function createLoggedOutSidebarHTML() {
  return `
    <a href="/login" class="login-btn">
      <i class="fas fa-sign-in-alt"></i>
      <span>Login / Sign Up</span>
    </a>
  `;
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

/**
 * Sets up event listeners for authentication-related interactions
 * 
 * Handles:
 * - User menu dropdown toggle
 * - Logout button clicks
 * - Click outside to close dropdown
 * - Keyboard navigation for accessibility
 * 
 * @returns {void}
 */
function setupAuthEventListeners() {
  // Set up user menu dropdown toggle
  setupUserMenuToggle();
  
  // Set up logout button handlers
  setupLogoutHandlers();
  
  // Set up click outside to close dropdown
  setupDropdownCloseHandlers();
  
  // Set up keyboard navigation
  setupKeyboardNavigation();
}

/**
 * Sets up user menu dropdown toggle functionality
 * Handles opening and closing of the user dropdown menu
 * 
 * @returns {void}
 */
function setupUserMenuToggle() {
  const userMenuTrigger = document.querySelector('.user-menu-trigger');
  
  if (userMenuTrigger) {
    userMenuTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const dropdown = this.nextElementSibling;
      const isOpen = dropdown.classList.contains('active');
      
      // Close all other dropdowns first
      closeAllDropdowns();
      
      if (!isOpen) {
        // Open this dropdown
        dropdown.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        
        // Focus first menu item for accessibility
        const firstMenuItem = dropdown.querySelector('.dropdown-item');
        if (firstMenuItem) {
          firstMenuItem.focus();
        }
      }
    });
  }
}

/**
 * Sets up logout button event handlers
 * Handles logout functionality for both desktop and mobile
 * 
 * @returns {void}
 */
function setupLogoutHandlers() {
  // Use event delegation to handle dynamically created logout buttons
  document.addEventListener('click', function(e) {
    if (e.target.closest('.logout-btn')) {
      e.preventDefault();
      handleLogout();
    }
  });
}

/**
 * Sets up handlers to close dropdown when clicking outside
 * Improves user experience by closing menus when focus moves away
 * 
 * @returns {void}
 */
function setupDropdownCloseHandlers() {
  document.addEventListener('click', function(e) {
    // Close dropdowns if click is outside any user menu
    if (!e.target.closest('.user-menu')) {
      closeAllDropdowns();
    }
  });
}

/**
 * Sets up keyboard navigation for accessibility
 * Handles Escape key to close dropdowns and arrow key navigation
 * 
 * @returns {void}
 */
function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
    
    // Handle arrow key navigation in dropdown menus
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const activeDropdown = document.querySelector('.user-dropdown.active');
      if (activeDropdown) {
        e.preventDefault();
        navigateDropdownItems(activeDropdown, e.key === 'ArrowDown');
      }
    }
  });
}

// ========================================
// LOGOUT FUNCTIONALITY
// ========================================

/**
 * Handles user logout process
 * 
 * Process:
 * 1. Shows loading state
 * 2. Makes API call to logout endpoint
 * 3. Updates UI to logged-out state
 * 4. Redirects to homepage or login page
 * 
 * @returns {Promise<void>}
 */
async function handleLogout() {
  try {
    // Show loading state
    showLogoutLoading();
    
    // Make logout API call
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Logout failed: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      // Clear current user data
      currentUser = null;
      
      // Update UI to logged-out state
      handleLoggedOutState();
      
      // Show success message
      showLogoutSuccess();
      
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
      
    } else {
      throw new Error('Logout failed');
    }
    
  } catch (error) {
    console.error('Logout error:', error);
    showLogoutError();
  }
}

/**
 * Handles the logged-out state across the application
 * Updates all authentication-related UI elements
 * 
 * @returns {void}
 */
function handleLoggedOutState() {
  // Update navbar
  updateDesktopNavAuth();
  updateMobileSidebarAuth();
  
  // Close any open dropdowns
  closeAllDropdowns();
  
  // Clear any cached user data
  currentUser = null;
}

// ========================================
// UI FEEDBACK FUNCTIONS
// ========================================

/**
 * Shows loading state during logout process
 * Provides visual feedback to user
 * 
 * @returns {void}
 */
function showLogoutLoading() {
  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(btn => {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging out...</span>';
    btn.disabled = true;
  });
}

/**
 * Shows success message after successful logout
 * 
 * @returns {void}
 */
function showLogoutSuccess() {
  // You can implement a toast notification here
  console.log('✅ Logout successful');
}

/**
 * Shows error message if logout fails
 * 
 * @returns {void}
 */
function showLogoutError() {
  // You can implement a toast notification here
  console.error('❌ Logout failed');
  alert('Logout failed. Please try again.');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Closes all open dropdown menus
 * Used when clicking outside or pressing Escape
 * 
 * @returns {void}
 */
function closeAllDropdowns() {
  const dropdowns = document.querySelectorAll('.user-dropdown.active');
  const triggers = document.querySelectorAll('.user-menu-trigger[aria-expanded=\"true\"]');
  
  dropdowns.forEach(dropdown => {
    dropdown.classList.remove('active');
  });
  
  triggers.forEach(trigger => {
    trigger.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Navigates dropdown menu items with keyboard
 * Supports arrow key navigation for accessibility
 * 
 * @param {HTMLElement} dropdown - The dropdown menu element
 * @param {boolean} moveDown - True for down arrow, false for up arrow
 * @returns {void}
 */
function navigateDropdownItems(dropdown, moveDown) {
  const items = dropdown.querySelectorAll('.dropdown-item');
  const currentIndex = Array.from(items).findIndex(item => item === document.activeElement);
  
  let nextIndex;
  if (moveDown) {
    nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
  } else {
    nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
  }
  
  items[nextIndex].focus();
}

/**
 * Escapes HTML characters to prevent XSS attacks
 * Used when displaying user-generated content
 * 
 * @param {string} text - Text to escape
 * @returns {string} Escaped text safe for HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Checks if user is currently authenticated
 * Utility function for other scripts
 * 
 * @returns {boolean} True if user is logged in
 */
function isUserAuthenticated() {
  return currentUser !== null;
}

/**
 * Gets current user information
 * Utility function for other scripts
 * 
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
  return currentUser;
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initializes the authentication navbar system
 * Called automatically when the script loads
 * 
 * @returns {void}
 */
function initAuthNavbar() {
  // Update navbar on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNavbarAuth);
  } else {
    updateNavbarAuth();
  }
  
  // Set up periodic authentication check (optional)
  // Uncomment if you want to periodically verify authentication status
  // setInterval(updateNavbarAuth, 300000); // Check every 5 minutes
}

// ========================================
// AUTO-INITIALIZATION
// ========================================

// Initialize the authentication navbar system
initAuthNavbar();

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    updateNavbarAuth,
    handleLogout,
    isUserAuthenticated,
    getCurrentUser
  };
}