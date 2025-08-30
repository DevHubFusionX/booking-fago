/**
 * HEADER COMPONENT - Reusable Navigation Component
 * ===============================================
 * 
 * This file contains the header/navigation functionality used across all pages.
 * It provides a responsive navigation system with mobile sidebar support.
 * 
 * Features:
 * - Responsive navigation bar
 * - Mobile hamburger menu
 * - Dynamic sidebar creation
 * - Touch-friendly mobile navigation
 * - Consistent header across all pages
 * 
 * Usage:
 * Include this script in any HTML page and call initMobileMenu() on page load
 * 
 * Dependencies:
 * - Font Awesome icons for hamburger menu
 * - CSS styles for .mobile-sidebar and related classes
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// MOBILE MENU INITIALIZATION
// ========================================

/**
 * Initializes the mobile menu functionality
 * This is the main function to call on page load
 * 
 * Sets up:
 * - Mobile sidebar HTML structure
 * - Event listeners for menu interactions
 * - Touch and click handlers
 * 
 * @returns {void}
 */
function initMobileMenu() {
  // Create the mobile sidebar HTML structure
  createMobileSidebar();
  
  // Set up event listeners for menu interactions
  setupMenuEventListeners();
}

// ========================================
// MOBILE SIDEBAR CREATION
// ========================================

/**
 * Creates the mobile sidebar HTML structure dynamically
 * This function generates the sidebar DOM elements and injects them into the page
 * 
 * Structure created:
 * - Overlay for closing menu when clicking outside
 * - Sidebar container with navigation links
 * - Close button for explicit menu closing
 * - Authentication links (login/logout based on user status)
 * 
 * @returns {void}
 */
function createMobileSidebar() {
  // Define the HTML structure for the mobile sidebar
  const sidebarHTML = `
    <!-- Overlay that appears behind the sidebar -->
    <div class="sidebar-overlay"></div>
    
    <!-- Main sidebar container -->
    <div class="mobile-sidebar">
      <!-- Sidebar header with logo and close button -->
      <div class="sidebar-header">
        <h3>FAGO</h3>
        <button class="sidebar-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <!-- Navigation links -->
      <nav class="sidebar-nav">
        <a href="/">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </a>
        <a href="/hotels">
          <i class="fas fa-building"></i>
          <span>Hotels</span>
        </a>
        <a href="/deals">
          <i class="fas fa-tags"></i>
          <span>Deals</span>
        </a>
        <a href="/about">
          <i class="fas fa-info-circle"></i>
          <span>About</span>
        </a>
        <a href="/contact">
          <i class="fas fa-envelope"></i>
          <span>Contact</span>
        </a>
      </nav>
      
      <!-- Authentication section -->
      <div class="sidebar-auth">
        <a href="/login" class="login-btn">
          <i class="fas fa-sign-in-alt"></i>
          <span>Login / Sign Up</span>
        </a>
      </div>
    </div>
  `;
  
  // Inject the sidebar HTML into the page body
  document.body.insertAdjacentHTML('beforeend', sidebarHTML);
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================

/**
 * Sets up all event listeners for mobile menu functionality
 * 
 * Event listeners added:
 * - Mobile menu button click (hamburger icon)
 * - Sidebar close button click
 * - Overlay click (close menu when clicking outside)
 * - Escape key press (accessibility feature)
 * 
 * @returns {void}
 */
function setupMenuEventListeners() {
  // Get references to menu elements
  const mobileMenuButton = document.getElementById('mobile-menu');
  const sidebarCloseButton = document.querySelector('.sidebar-close');
  const sidebarOverlay = document.querySelector('.sidebar-overlay');
  
  // Mobile menu button click handler
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default button behavior
      openSidebar();
    });
  }
  
  // Sidebar close button click handler
  if (sidebarCloseButton) {
    sidebarCloseButton.addEventListener('click', function(e) {
      e.preventDefault();
      closeSidebar();
    });
  }
  
  // Overlay click handler (close menu when clicking outside)
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
      closeSidebar();
    });
  }
  
  // Keyboard accessibility - close menu with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });
}

// ========================================
// SIDEBAR CONTROL FUNCTIONS
// ========================================

/**
 * Opens the mobile sidebar menu
 * 
 * Actions performed:
 * - Shows the overlay with fade-in effect
 * - Slides in the sidebar from the right
 * - Prevents body scrolling while menu is open
 * - Adds appropriate CSS classes for animations
 * 
 * @returns {void}
 */
function openSidebar() {
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebar = document.querySelector('.mobile-sidebar');
  
  // Add active classes to trigger CSS animations
  if (overlay) overlay.classList.add('active');
  if (sidebar) sidebar.classList.add('active');
  
  // Prevent background scrolling while menu is open
  document.body.style.overflow = 'hidden';
  
  // Add class to body for additional styling if needed
  document.body.classList.add('sidebar-open');
}

/**
 * Closes the mobile sidebar menu
 * 
 * Actions performed:
 * - Hides the overlay with fade-out effect
 * - Slides out the sidebar to the right
 * - Restores body scrolling
 * - Removes CSS classes to trigger close animations
 * 
 * @returns {void}
 */
function closeSidebar() {
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebar = document.querySelector('.mobile-sidebar');
  
  // Remove active classes to trigger CSS close animations
  if (overlay) overlay.classList.remove('active');
  if (sidebar) sidebar.classList.remove('active');
  
  // Restore background scrolling
  document.body.style.overflow = '';
  
  // Remove body class
  document.body.classList.remove('sidebar-open');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Checks if the mobile sidebar is currently open
 * Useful for conditional logic in other parts of the application
 * 
 * @returns {boolean} True if sidebar is open, false otherwise
 */
function isSidebarOpen() {
  const sidebar = document.querySelector('.mobile-sidebar');
  return sidebar && sidebar.classList.contains('active');
}

/**
 * Toggles the mobile sidebar (open if closed, close if open)
 * Alternative to separate open/close functions
 * 
 * @returns {void}
 */
function toggleSidebar() {
  if (isSidebarOpen()) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

// ========================================
// RESPONSIVE BEHAVIOR
// ========================================

/**
 * Handles window resize events
 * Automatically closes mobile menu when screen becomes large enough
 * Prevents menu from staying open when switching to desktop view
 */
window.addEventListener('resize', function() {
  // Close sidebar if window becomes wider than mobile breakpoint
  if (window.innerWidth > 768 && isSidebarOpen()) {
    closeSidebar();
  }
});

// ========================================
// ACCESSIBILITY FEATURES
// ========================================

/**
 * Manages focus for accessibility
 * Ensures proper keyboard navigation when sidebar is open
 */
function manageFocus() {
  const sidebar = document.querySelector('.mobile-sidebar');
  const firstFocusableElement = sidebar.querySelector('a, button');
  
  if (isSidebarOpen() && firstFocusableElement) {
    // Focus first element when sidebar opens
    firstFocusableElement.focus();
  }
}

// ========================================
// INITIALIZATION CHECK
// ========================================

/**
 * Ensures the component is properly initialized
 * Provides helpful error messages if required elements are missing
 */
function validateHeaderComponent() {
  const mobileMenuButton = document.getElementById('mobile-menu');
  
  if (!mobileMenuButton) {
    console.warn('Header Component: Mobile menu button not found. Ensure element with id="mobile-menu" exists.');
  }
  
  // Check if Font Awesome is loaded for icons
  if (!document.querySelector('link[href*="font-awesome"]') && !document.querySelector('link[href*="fontawesome"]')) {
    console.warn('Header Component: Font Awesome not detected. Icons may not display correctly.');
  }
}

// Run validation when script loads
document.addEventListener('DOMContentLoaded', validateHeaderComponent);

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initMobileMenu,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    isSidebarOpen
  };
}