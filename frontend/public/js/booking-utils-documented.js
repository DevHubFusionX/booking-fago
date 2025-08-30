/**
 * BOOKING UTILITIES - HELPER FUNCTIONS FOR BOOKING PROCESS
 * ========================================================
 * 
 * This utility library provides common functions used throughout the booking process.
 * It includes validation, formatting, error handling, and UI helper functions.
 * 
 * Features:
 * - Form validation utilities
 * - Date and price formatting functions
 * - Error message handling
 * - Loading state management
 * - Local storage helpers
 * - Payment status utilities
 * 
 * Usage:
 * Include this script before other booking-related scripts
 * Access functions via the BookingUtils namespace
 * 
 * Example:
 * BookingUtils.validateGuestDetails(guestData);
 * BookingUtils.formatPrice(94500);
 * BookingUtils.showError('Payment failed');
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// BOOKING UTILITIES NAMESPACE
// ========================================

/**
 * Main namespace for all booking utility functions
 * Prevents global namespace pollution
 */
window.BookingUtils = (function() {
  'use strict';

  // ========================================
  // PRIVATE VARIABLES
  // ========================================

  /**
   * Configuration object for validation rules
   * @private
   */
  const config = {
    minNameLength: 2,
    maxNameLength: 50,
    phoneRegex: /^[\+]?[0-9\s\-\(\)]{10,15}$/,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    maxRequestsLength: 500
  };

  /**
   * Error message templates
   * @private
   */
  const errorMessages = {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    nameTooShort: `Name must be at least ${config.minNameLength} characters`,
    nameTooLong: `Name must be less than ${config.maxNameLength} characters`,
    requestsTooLong: `Special requests must be less than ${config.maxRequestsLength} characters`
  };

  // ========================================
  // VALIDATION FUNCTIONS
  // ========================================

  /**
   * Validates guest details form data
   * Throws error if validation fails
   * 
   * @param {Object} guestDetails - Guest information object
   * @param {string} guestDetails.firstName - Guest's first name
   * @param {string} guestDetails.lastName - Guest's last name
   * @param {string} guestDetails.email - Guest's email address
   * @param {string} guestDetails.phone - Guest's phone number
   * @param {string} [guestDetails.requests] - Special requests (optional)
   * @throws {Error} Validation error with descriptive message
   */
  function validateGuestDetails(guestDetails) {
    // Validate first name
    if (!guestDetails.firstName || guestDetails.firstName.trim().length === 0) {
      throw new Error('First name is required');
    }
    if (guestDetails.firstName.trim().length < config.minNameLength) {
      throw new Error(errorMessages.nameTooShort);
    }
    if (guestDetails.firstName.trim().length > config.maxNameLength) {
      throw new Error(errorMessages.nameTooLong);
    }

    // Validate last name
    if (!guestDetails.lastName || guestDetails.lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }
    if (guestDetails.lastName.trim().length < config.minNameLength) {
      throw new Error(errorMessages.nameTooShort);
    }
    if (guestDetails.lastName.trim().length > config.maxNameLength) {
      throw new Error(errorMessages.nameTooLong);
    }

    // Validate email
    if (!guestDetails.email || guestDetails.email.trim().length === 0) {
      throw new Error('Email address is required');
    }
    if (!config.emailRegex.test(guestDetails.email.trim())) {
      throw new Error(errorMessages.invalidEmail);
    }

    // Validate phone number
    if (!guestDetails.phone || guestDetails.phone.trim().length === 0) {
      throw new Error('Phone number is required');
    }
    if (!config.phoneRegex.test(guestDetails.phone.trim())) {
      throw new Error(errorMessages.invalidPhone);
    }

    // Validate special requests (optional field)
    if (guestDetails.requests && guestDetails.requests.length > config.maxRequestsLength) {
      throw new Error(errorMessages.requestsTooLong);
    }
  }

  /**
   * Validates booking dates
   * Ensures check-in is before check-out and dates are in the future
   * 
   * @param {string} checkinDate - Check-in date in YYYY-MM-DD format
   * @param {string} checkoutDate - Check-out date in YYYY-MM-DD format
   * @throws {Error} Date validation error
   */
  function validateBookingDates(checkinDate, checkoutDate) {
    const today = new Date();
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    checkin.setHours(0, 0, 0, 0);
    checkout.setHours(0, 0, 0, 0);

    // Check if check-in date is in the past
    if (checkin < today) {
      throw new Error('Check-in date cannot be in the past');
    }

    // Check if check-out date is before check-in date
    if (checkout <= checkin) {
      throw new Error('Check-out date must be after check-in date');
    }

    // Check if booking is too far in the future (optional business rule)
    const maxAdvanceBooking = new Date();
    maxAdvanceBooking.setFullYear(maxAdvanceBooking.getFullYear() + 2);
    
    if (checkin > maxAdvanceBooking) {
      throw new Error('Bookings can only be made up to 2 years in advance');
    }
  }

  /**
   * Validates payment amount
   * Ensures amount is positive and within reasonable limits
   * 
   * @param {number} amount - Payment amount in Naira
   * @throws {Error} Amount validation error
   */
  function validatePaymentAmount(amount) {
    if (!amount || typeof amount !== 'number') {
      throw new Error('Invalid payment amount');
    }

    if (amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }

    // Set reasonable limits (adjust based on business requirements)
    const minAmount = 1000; // ₦1,000 minimum
    const maxAmount = 10000000; // ₦10,000,000 maximum

    if (amount < minAmount) {
      throw new Error(`Minimum booking amount is ₦${minAmount.toLocaleString()}`);
    }

    if (amount > maxAmount) {
      throw new Error(`Maximum booking amount is ₦${maxAmount.toLocaleString()}`);
    }
  }

  // ========================================
  // FORMATTING FUNCTIONS
  // ========================================

  /**
   * Formats price in Nigerian Naira
   * Adds currency symbol and proper number formatting
   * 
   * @param {number} amount - Amount to format
   * @param {boolean} [includeSymbol=true] - Whether to include ₦ symbol
   * @returns {string} Formatted price string
   */
  function formatPrice(amount, includeSymbol = true) {
    if (typeof amount !== 'number' || isNaN(amount)) {
      return includeSymbol ? '₦0' : '0';
    }

    const formatted = amount.toLocaleString('en-NG');
    return includeSymbol ? `₦${formatted}` : formatted;
  }

  /**
   * Formats date for display
   * Converts date string to readable format
   * 
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @param {string} [format='short'] - Format type ('short', 'long', 'medium')
   * @returns {string} Formatted date string
   */
  function formatDate(dateString, format = 'short') {
    if (!dateString) return '';

    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      medium: { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    };

    return date.toLocaleDateString('en-US', options[format] || options.short);
  }

  /**
   * Calculates number of nights between two dates
   * 
   * @param {string} checkinDate - Check-in date in YYYY-MM-DD format
   * @param {string} checkoutDate - Check-out date in YYYY-MM-DD format
   * @returns {number} Number of nights
   */
  function calculateNights(checkinDate, checkoutDate) {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    
    if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
      return 0;
    }

    const timeDiff = checkout.getTime() - checkin.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return Math.max(0, daysDiff);
  }

  // ========================================
  // UI HELPER FUNCTIONS
  // ========================================

  /**
   * Shows error message to user
   * Creates and displays error notification
   * 
   * @param {string} message - Error message to display
   * @param {number} [duration=5000] - How long to show message (ms)
   */
  function showError(message, duration = 5000) {
    // Remove existing error messages
    removeExistingMessages();

    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'booking-error-message';
    errorDiv.innerHTML = `
      <div class="error-content">
        <i class="fas fa-exclamation-triangle"></i>
        <span>${escapeHtml(message)}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles if not already present
    addErrorStyles();

    // Insert error message at top of page
    document.body.insertBefore(errorDiv, document.body.firstChild);

    // Auto-remove after duration
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, duration);
  }

  /**
   * Shows success message to user
   * Creates and displays success notification
   * 
   * @param {string} message - Success message to display
   * @param {number} [duration=3000] - How long to show message (ms)
   */
  function showSuccess(message, duration = 3000) {
    // Remove existing messages
    removeExistingMessages();

    // Create success element
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success-message';
    successDiv.innerHTML = `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <span>${escapeHtml(message)}</span>
        <button class="success-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles if not already present
    addSuccessStyles();

    // Insert success message at top of page
    document.body.insertBefore(successDiv, document.body.firstChild);

    // Auto-remove after duration
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove();
      }
    }, duration);
  }

  /**
   * Shows loading state on element
   * Disables element and shows loading indicator
   * 
   * @param {HTMLElement} element - Element to show loading on
   * @param {string} [loadingText='Loading...'] - Text to show while loading
   */
  function showLoading(element, loadingText = 'Loading...') {
    if (!element) return;

    // Store original content
    element.dataset.originalContent = element.innerHTML;
    element.dataset.originalDisabled = element.disabled;

    // Set loading state
    element.disabled = true;
    element.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
    element.classList.add('loading');
  }

  /**
   * Hides loading state on element
   * Restores element to original state
   * 
   * @param {HTMLElement} element - Element to hide loading from
   */
  function hideLoading(element) {
    if (!element) return;

    // Restore original content and state
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
      delete element.dataset.originalContent;
    }

    if (element.dataset.originalDisabled !== undefined) {
      element.disabled = element.dataset.originalDisabled === 'true';
      delete element.dataset.originalDisabled;
    }

    element.classList.remove('loading');
  }

  // ========================================
  // LOCAL STORAGE HELPERS
  // ========================================

  /**
   * Saves booking data to session storage
   * Persists booking information across page reloads
   * 
   * @param {Object} bookingData - Booking data to save
   */
  function saveBookingData(bookingData) {
    try {
      sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    } catch (error) {
      console.warn('Failed to save booking data to session storage:', error);
    }
  }

  /**
   * Loads booking data from session storage
   * Retrieves previously saved booking information
   * 
   * @returns {Object|null} Saved booking data or null if not found
   */
  function loadBookingData() {
    try {
      const data = sessionStorage.getItem('bookingData');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load booking data from session storage:', error);
      return null;
    }
  }

  /**
   * Clears booking data from session storage
   * Removes saved booking information
   */
  function clearBookingData() {
    try {
      sessionStorage.removeItem('bookingData');
    } catch (error) {
      console.warn('Failed to clear booking data from session storage:', error);
    }
  }

  // ========================================
  // PRIVATE HELPER FUNCTIONS
  // ========================================

  /**
   * Escapes HTML characters to prevent XSS
   * @private
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Removes existing error/success messages
   * @private
   */
  function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.booking-error-message, .booking-success-message');
    existingMessages.forEach(msg => msg.remove());
  }

  /**
   * Adds error message styles to page
   * @private
   */
  function addErrorStyles() {
    if (document.getElementById('booking-error-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'booking-error-styles';
    styles.textContent = `
      .booking-error-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        padding: 0;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease-out;
      }
      .error-content {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        color: #c33;
      }
      .error-content i:first-child {
        margin-right: 8px;
        font-size: 16px;
      }
      .error-close {
        background: none;
        border: none;
        color: #c33;
        cursor: pointer;
        margin-left: 12px;
        padding: 4px;
        border-radius: 4px;
      }
      .error-close:hover {
        background: rgba(204, 51, 51, 0.1);
      }
      @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styles);
  }

  /**
   * Adds success message styles to page
   * @private
   */
  function addSuccessStyles() {
    if (document.getElementById('booking-success-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'booking-success-styles';
    styles.textContent = `
      .booking-success-message {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #efe;
        border: 1px solid #cfc;
        border-radius: 8px;
        padding: 0;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideDown 0.3s ease-out;
      }
      .success-content {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        color: #3c3;
      }
      .success-content i:first-child {
        margin-right: 8px;
        font-size: 16px;
      }
      .success-close {
        background: none;
        border: none;
        color: #3c3;
        cursor: pointer;
        margin-left: 12px;
        padding: 4px;
        border-radius: 4px;
      }
      .success-close:hover {
        background: rgba(51, 204, 51, 0.1);
      }
    `;
    document.head.appendChild(styles);
  }

  // ========================================
  // PUBLIC API
  // ========================================

  /**
   * Public interface for BookingUtils
   * Exposes all utility functions
   */
  return {
    // Validation functions
    validateGuestDetails,
    validateBookingDates,
    validatePaymentAmount,

    // Formatting functions
    formatPrice,
    formatDate,
    calculateNights,

    // UI helper functions
    showError,
    showSuccess,
    showLoading,
    hideLoading,

    // Local storage helpers
    saveBookingData,
    loadBookingData,
    clearBookingData,

    // Configuration access (read-only)
    config: Object.freeze({ ...config })
  };

})();

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize booking utilities when DOM is ready
 * Sets up any required global event listeners
 */
document.addEventListener('DOMContentLoaded', function() {
  // Add global error handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Show user-friendly error message
    if (window.BookingUtils) {
      BookingUtils.showError('An unexpected error occurred. Please try again.');
    }
  });

  // Add global error handler for JavaScript errors
  window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    
    // Only show error message for booking-related errors
    if (event.filename && event.filename.includes('booking')) {
      if (window.BookingUtils) {
        BookingUtils.showError('A technical error occurred. Please refresh the page and try again.');
      }
    }
  });
});

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the BookingUtils object
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.BookingUtils;
}