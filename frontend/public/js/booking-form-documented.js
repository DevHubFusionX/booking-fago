/**
 * BOOKING FORM HANDLER - HOTEL BOOKING FORM FUNCTIONALITY
 * =======================================================
 * 
 * This module handles the booking form functionality on hotel details pages.
 * It manages date selection, room selection, price calculations, and booking submission.
 * 
 * Features:
 * - Date validation and minimum date setting
 * - Real-time price calculation based on dates and room selection
 * - Form validation with user-friendly error messages
 * - Integration with authentication system
 * - Session storage for booking data persistence
 * - Responsive error handling and user feedback
 * 
 * Dependencies:
 * - BookingUtils for validation and error handling
 * - Authentication system for user verification
 * - Session storage for data persistence
 * - selectedRoom and currentHotel global variables
 * 
 * Usage:
 * Call initBookingForm() on page load to set up all functionality
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// INITIALIZATION FUNCTION
// ========================================

/**
 * Initializes the booking form with date validation and event listeners
 * Sets up minimum dates, calculation triggers, and form submission handling
 * 
 * Call this function when the DOM is ready to activate booking functionality
 */
function initBookingForm() {
  // Set minimum dates to today to prevent past date selection
  const today = new Date().toISOString().split('T')[0];
  
  // Get date input elements
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  // Set minimum dates
  if (checkinInput) checkinInput.min = today;
  if (checkoutInput) checkoutInput.min = today;

  // Set up event listeners for real-time price calculation
  if (checkinInput) {
    checkinInput.addEventListener('change', calculateTotal);
  }
  
  if (checkoutInput) {
    checkoutInput.addEventListener('change', calculateTotal);
  }
  
  // Set up form submission handler
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBooking);
  }
  
  console.log('📅 Booking form initialized');
}

// ========================================
// PRICE CALCULATION FUNCTION
// ========================================

/**
 * Calculates and displays the total booking price
 * Updates the booking summary with nights, subtotal, service fee, and total
 * 
 * Calculation includes:
 * - Number of nights between check-in and check-out
 * - Subtotal (nights × room price per night)
 * - Service fee (5% of subtotal)
 * - Final total (subtotal + service fee)
 * 
 * Updates the DOM element with ID 'booking-summary'
 */
function calculateTotal() {
  // Get date values from form inputs
  const checkinValue = document.getElementById('checkin')?.value;
  const checkoutValue = document.getElementById('checkout')?.value;
  
  // Validate that we have all required data
  if (!checkinValue || !checkoutValue || !selectedRoom) {
    return; // Exit if missing required data
  }
  
  // Convert date strings to Date objects
  const checkin = new Date(checkinValue);
  const checkout = new Date(checkoutValue);
  
  // Validate date range
  if (checkout <= checkin) {
    return; // Exit if checkout is not after checkin
  }
  
  // Calculate number of nights
  const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
  
  // Get room price per night
  const pricePerNight = selectedRoom.price_per_night;
  
  // Calculate pricing breakdown
  const subtotal = nights * pricePerNight;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;

  // Update booking summary display
  const summaryElement = document.getElementById('booking-summary');
  if (summaryElement) {
    summaryElement.innerHTML = `
      <div class="summary-row">
        <span>₦${pricePerNight.toLocaleString()} x ${nights} nights</span>
        <span>₦${subtotal.toLocaleString()}</span>
      </div>
      <div class="summary-row">
        <span>Service fee (5%)</span>
        <span>₦${serviceFee.toLocaleString()}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>₦${total.toLocaleString()}</span>
      </div>
    `;
  }
  
  console.log(`💰 Price calculated: ₦${total.toLocaleString()} for ${nights} nights`);
}

// ========================================
// BOOKING SUBMISSION HANDLER
// ========================================

/**
 * Handles booking form submission with comprehensive validation
 * 
 * Process:
 * 1. Prevents default form submission
 * 2. Checks user authentication status
 * 3. Validates form data (dates, room selection)
 * 4. Calculates final pricing
 * 5. Stores booking data in session storage
 * 6. Redirects to booking page for payment
 * 
 * @param {Event} e - Form submission event
 */
async function handleBooking(e) {
  // Prevent default form submission
  e.preventDefault();
  
  try {
    // ========================================
    // AUTHENTICATION CHECK
    // ========================================
    
    // Check if user is logged in
    const response = await fetch('/api/user');
    const userData = await response.json();
    
    if (!userData.user) {
      // User not authenticated - show error and redirect to login
      const errorMessage = 'Please login to make a booking';
      
      if (window.BookingUtils) {
        BookingUtils.showError(errorMessage);
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        alert(errorMessage);
        window.location.href = '/login';
      }
      return;
    }

    // ========================================
    // FORM DATA EXTRACTION
    // ========================================
    
    // Get form values
    const checkin = document.getElementById('checkin')?.value;
    const checkout = document.getElementById('checkout')?.value;
    const guests = document.getElementById('guests')?.value;
    
    // ========================================
    // FORM VALIDATION
    // ========================================
    
    // Validate required dates
    if (!checkin || !checkout) {
      const errorMessage = 'Please select check-in and check-out dates';
      
      if (window.BookingUtils) {
        BookingUtils.showError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return;
    }
    
    // Validate room selection
    if (!selectedRoom) {
      const errorMessage = 'Please select a room type';
      
      if (window.BookingUtils) {
        BookingUtils.showError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return;
    }
    
    // ========================================
    // DATE VALIDATION
    // ========================================
    
    // Convert dates for validation
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
    
    // Check if check-in date is in the past
    if (checkinDate < today) {
      const errorMessage = 'Check-in date cannot be in the past';
      
      if (window.BookingUtils) {
        BookingUtils.showError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return;
    }
    
    // Check if check-out date is after check-in date
    if (checkoutDate <= checkinDate) {
      const errorMessage = 'Check-out date must be after check-in date';
      
      if (window.BookingUtils) {
        BookingUtils.showError(errorMessage);
      } else {
        alert(errorMessage);
      }
      return;
    }
    
    // ========================================
    // PRICE CALCULATION
    // ========================================
    
    // Calculate booking details
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    const subtotal = nights * selectedRoom.price_per_night;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const total = subtotal + serviceFee;
    
    // ========================================
    // BOOKING DATA PREPARATION
    // ========================================
    
    // Create comprehensive booking data object
    const bookingData = {
      // Hotel information
      hotelId: currentHotel._id,
      hotelName: currentHotel.name,
      hotelLocation: currentHotel.location,
      
      // Booking dates and details
      checkin,
      checkout,
      guests: parseInt(guests),
      nights,
      
      // Room information
      roomType: selectedRoom.room_type,
      pricePerNight: selectedRoom.price_per_night,
      
      // Pricing breakdown
      subtotal,
      serviceFee,
      total
    };
    
    // ========================================
    // DATA PERSISTENCE AND REDIRECT
    // ========================================
    
    // Store booking data in session storage for booking page
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Show success message and redirect
    if (window.BookingUtils) {
      BookingUtils.showSuccess('Redirecting to booking page...');
      setTimeout(() => window.location.href = '/booking', 1000);
    } else {
      window.location.href = '/booking';
    }
    
    console.log('✅ Booking data prepared and stored:', bookingData);
    
  } catch (error) {
    // ========================================
    // ERROR HANDLING
    // ========================================
    
    console.error('Error processing booking:', error);
    
    // Show error message and redirect to login as fallback
    const errorMessage = 'Please login to make a booking';
    
    if (window.BookingUtils) {
      BookingUtils.showError(errorMessage);
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      alert(errorMessage);
      window.location.href = '/login';
    }
  }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Validates booking form data
 * Can be called independently for validation without submission
 * 
 * @returns {Object} Validation result with success status and errors
 */
function validateBookingForm() {
  const errors = [];
  
  // Check dates
  const checkin = document.getElementById('checkin')?.value;
  const checkout = document.getElementById('checkout')?.value;
  
  if (!checkin) errors.push('Check-in date is required');
  if (!checkout) errors.push('Check-out date is required');
  
  if (checkin && checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkinDate < today) {
      errors.push('Check-in date cannot be in the past');
    }
    
    if (checkoutDate <= checkinDate) {
      errors.push('Check-out date must be after check-in date');
    }
  }
  
  // Check room selection
  if (!selectedRoom) {
    errors.push('Please select a room type');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Resets the booking form to initial state
 * Clears all inputs and selections
 */
function resetBookingForm() {
  // Clear date inputs
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  const guestsInput = document.getElementById('guests');
  
  if (checkinInput) checkinInput.value = '';
  if (checkoutInput) checkoutInput.value = '';
  if (guestsInput) guestsInput.value = '2'; // Default to 2 guests
  
  // Clear room selection
  selectedRoom = null;
  document.querySelectorAll('.room-option').forEach(option => {
    option.classList.remove('selected');
  });
  
  // Clear booking summary
  const summaryElement = document.getElementById('booking-summary');
  if (summaryElement) {
    summaryElement.innerHTML = '<p>Select dates and room to see pricing</p>';
  }
  
  // Disable booking button
  const bookBtn = document.getElementById('book-now-btn');
  if (bookBtn) {
    bookBtn.disabled = true;
    bookBtn.textContent = 'Select Room First';
  }
  
  console.log('🔄 Booking form reset');
}

/**
 * Updates minimum checkout date when checkin date changes
 * Ensures checkout is always after checkin
 * 
 * @param {string} checkinDate - Selected checkin date
 */
function updateCheckoutMinDate(checkinDate) {
  const checkoutInput = document.getElementById('checkout');
  if (checkoutInput && checkinDate) {
    // Set minimum checkout date to day after checkin
    const checkin = new Date(checkinDate);
    checkin.setDate(checkin.getDate() + 1);
    checkoutInput.min = checkin.toISOString().split('T')[0];
    
    // Clear checkout if it's now invalid
    if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(checkinDate)) {
      checkoutInput.value = '';
    }
  }
}

// ========================================
// EVENT LISTENERS FOR ENHANCED FUNCTIONALITY
// ========================================

// Update checkout minimum date when checkin changes
document.addEventListener('DOMContentLoaded', () => {
  const checkinInput = document.getElementById('checkin');
  if (checkinInput) {
    checkinInput.addEventListener('change', (e) => {
      updateCheckoutMinDate(e.target.value);
      calculateTotal(); // Recalculate when dates change
    });
  }
});

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initBookingForm,
    calculateTotal,
    handleBooking,
    validateBookingForm,
    resetBookingForm,
    updateCheckoutMinDate
  };
}