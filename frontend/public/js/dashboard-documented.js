/**
 * DASHBOARD FUNCTIONALITY - USER DASHBOARD MANAGEMENT
 * ==================================================
 * 
 * This module handles all functionality for the user dashboard page.
 * It manages user authentication, booking display, filtering, and navigation.
 * 
 * Features:
 * - User authentication verification and redirect
 * - Booking history loading with skeleton animations
 * - Tab navigation between dashboard sections
 * - Booking status filtering (all, upcoming, past, cancelled)
 * - Responsive design with mobile menu integration
 * - Error handling and user feedback
 * 
 * Dashboard Sections:
 * - My Bookings: Display and filter user's booking history
 * - Profile: User profile information and settings
 * - Favorites: Saved hotels and preferences
 * 
 * Dependencies:
 * - Authentication system for user verification
 * - Booking API for fetching user bookings
 * - Skeleton loading system for better UX
 * - Mobile navigation component
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// GLOBAL VARIABLES
// ========================================

/**
 * Array to store all user bookings
 * Used for filtering and display management
 * @type {Array<Object>}
 */
let allBookings = [];

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize dashboard when DOM is ready
 * Sets up authentication, loads user data, and initializes UI components
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize mobile navigation menu
  initMobileMenu();
  
  // Load and verify user authentication
  await loadUserData();
  
  // Initialize dashboard UI components
  initDashboard();
  
  // Update authentication navbar (delayed to ensure sidebar is created)
  setTimeout(updateNavbarAuth, 100);
  
  console.log('📊 Dashboard initialized');
});

// ========================================
// USER AUTHENTICATION AND DATA LOADING
// ========================================

/**
 * Loads user data and verifies authentication
 * Redirects to login page if user is not authenticated
 * Updates UI with user information and loads bookings
 */
async function loadUserData() {
  try {
    // Check authentication status
    const response = await fetch('/api/user');
    const data = await response.json();
    
    // Redirect to login if not authenticated
    if (!data.user) {
      console.log('❌ User not authenticated, redirecting to login');
      window.location.href = '/login';
      return;
    }
    
    // Update UI with user information
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
      userNameElement.textContent = data.user.name;
    }
    
    // Load user's booking history
    await loadBookings();
    
    console.log('✅ User data loaded:', data.user.name);
    
  } catch (error) {
    console.error('Error loading user data:', error);
    
    // Redirect to login on any error
    window.location.href = '/login';
  }
}

/**
 * Loads user bookings from the API
 * Displays bookings with skeleton loading animation
 * Handles empty states and error conditions
 */
async function loadBookings() {
  const bookingsList = document.getElementById('bookings-list');
  
  if (!bookingsList) {
    console.warn('Bookings list element not found');
    return;
  }
  
  // Show skeleton loading animation
  if (window.showSkeletons) {
    showSkeletons(bookingsList, 'booking-card', 3);
  }
  
  try {
    // Fetch bookings from API
    const response = await fetch('/api/bookings');
    const data = await response.json();
    
    // Simulate loading delay for better UX (remove in production if not needed)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (data.success && data.bookings.length > 0) {
      // Store bookings globally for filtering
      allBookings = data.bookings;
      
      // Generate booking cards HTML
      const bookingCards = data.bookings.map(booking => createBookingCard(booking)).join('');
      
      // Hide skeletons and show content
      if (window.hideSkeletons) {
        hideSkeletons(bookingsList, bookingCards);
      } else {
        bookingsList.innerHTML = bookingCards;
      }
      
      console.log(`📋 Loaded ${data.bookings.length} bookings`);
      
    } else {
      // Handle empty bookings state
      allBookings = [];
      const noBookingsHTML = `
        <div class="no-bookings">
          <div class="empty-state">
            <i class="fas fa-calendar-times"></i>
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet.</p>
            <a href="/hotels" class="btn-primary">Book your first hotel</a>
          </div>
        </div>
      `;
      
      if (window.hideSkeletons) {
        hideSkeletons(bookingsList, noBookingsHTML);
      } else {
        bookingsList.innerHTML = noBookingsHTML;
      }
      
      console.log('📋 No bookings found');
    }
    
  } catch (error) {
    console.error('Error loading bookings:', error);
    
    // Show error state
    const errorHTML = `
      <div class="error-message">
        <div class="error-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Failed to load bookings</h3>
          <p>Please try refreshing the page.</p>
          <button onclick="loadBookings()" class="btn-secondary">Try Again</button>
        </div>
      </div>
    `;
    
    if (window.hideSkeletons) {
      hideSkeletons(bookingsList, errorHTML);
    } else {
      bookingsList.innerHTML = errorHTML;
    }
  }
}

// ========================================
// DASHBOARD UI INITIALIZATION
// ========================================

/**
 * Initializes dashboard UI components
 * Sets up tab navigation and booking filters
 */
function initDashboard() {
  // Initialize tab navigation
  initTabNavigation();
  
  // Initialize booking filters
  initBookingFilters();
  
  console.log('🎛️ Dashboard UI components initialized');
}

/**
 * Sets up tab navigation between dashboard sections
 * Handles switching between My Bookings, Profile, and Favorites
 */
function initTabNavigation() {
  // Get all navigation items
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      const tab = this.dataset.tab;
      
      if (!tab) return;
      
      // Update navigation active state
      navItems.forEach(nav => nav.classList.remove('active'));
      this.classList.add('active');
      
      // Update section visibility
      const sections = document.querySelectorAll('.dashboard-section');
      sections.forEach(section => section.classList.remove('active'));
      
      const targetSection = document.getElementById(tab);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      
      console.log(`📑 Switched to ${tab} tab`);
    });
  });
}

/**
 * Sets up booking filter functionality
 * Handles filtering by booking status (all, upcoming, past, cancelled)
 */
function initBookingFilters() {
  // Get all filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Update filter button active state
      filterButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Apply filter
      const filter = this.dataset.filter;
      filterBookings(filter);
      
      console.log(`🔍 Applied filter: ${filter}`);
    });
  });
}

// ========================================
// BOOKING FILTERING FUNCTIONALITY
// ========================================

/**
 * Filters bookings based on selected criteria
 * Shows/hides booking cards based on their status and dates
 * 
 * @param {string} filter - Filter type ('all', 'upcoming', 'past', 'cancelled')
 */
function filterBookings(filter) {
  const bookingCards = document.querySelectorAll('.booking-card');
  
  bookingCards.forEach(booking => {
    const status = booking.dataset.status;
    const isUpcoming = booking.classList.contains('upcoming');
    const isPast = booking.classList.contains('past');
    
    let shouldShow = false;
    
    // Determine if booking should be shown based on filter
    switch(filter) {
      case 'all':
        shouldShow = true;
        break;
        
      case 'upcoming':
        shouldShow = isUpcoming && status !== 'cancelled';
        break;
        
      case 'past':
        shouldShow = isPast && status !== 'cancelled';
        break;
        
      case 'cancelled':
        shouldShow = status === 'cancelled';
        break;
        
      default:
        shouldShow = true;
    }
    
    // Show or hide the booking card
    booking.style.display = shouldShow ? 'block' : 'none';
  });
  
  // Update results count
  updateFilterResultsCount(filter);
}

/**
 * Updates the count of visible bookings after filtering
 * 
 * @param {string} filter - Current filter type
 */
function updateFilterResultsCount(filter) {
  const visibleBookings = document.querySelectorAll('.booking-card[style*="block"], .booking-card:not([style*="none"])');
  const countElement = document.getElementById('bookings-count');
  
  if (countElement) {
    const count = visibleBookings.length;
    const filterText = filter === 'all' ? 'bookings' : `${filter} bookings`;
    countElement.textContent = `${count} ${filterText}`;
  }
}

// ========================================
// BOOKING CARD CREATION
// ========================================

/**
 * Creates HTML for a booking card
 * Generates a card with booking details, status, and action buttons
 * 
 * @param {Object} booking - Booking data object
 * @returns {string} HTML string for booking card
 */
function createBookingCard(booking) {
  // Determine booking status and dates
  const checkinDate = new Date(booking.check_in);
  const checkoutDate = new Date(booking.check_out);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Determine if booking is upcoming or past
  const isUpcoming = checkinDate >= today;
  const isPast = checkoutDate < today;
  const status = booking.payment_status || 'confirmed';
  
  // Format dates for display
  const checkinFormatted = checkinDate.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  const checkoutFormatted = checkoutDate.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
  
  // Determine status badge class and text
  let statusClass = 'confirmed';
  let statusText = 'Confirmed';
  
  if (status === 'cancelled') {
    statusClass = 'cancelled';
    statusText = 'Cancelled';
  } else if (status === 'pending') {
    statusClass = 'pending';
    statusText = 'Pending';
  }
  
  return `
    <div class="booking-card ${isUpcoming ? 'upcoming' : 'past'}" 
         data-status="${status}" 
         data-booking-id="${booking._id}">
      
      <!-- Booking Status Badge -->
      <div class="booking-status">
        <span class="status-badge ${statusClass}">${statusText}</span>
      </div>
      
      <!-- Hotel Information -->
      <div class="booking-hotel">
        <div class="hotel-image">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop" 
               alt="Hotel" class="lazy-image">
        </div>
        <div class="hotel-info">
          <h4>${booking.hotel_name || 'Hotel Name'}</h4>
          <p><i class="fas fa-map-marker-alt"></i> ${booking.hotel_location || 'Location'}</p>
          <p><i class="fas fa-bed"></i> ${booking.room_type || 'Room Type'}</p>
        </div>
      </div>
      
      <!-- Booking Details -->
      <div class="booking-details">
        <div class="booking-dates">
          <div class="date-item">
            <span class="date-label">Check-in</span>
            <span class="date-value">${checkinFormatted}</span>
          </div>
          <div class="date-item">
            <span class="date-label">Check-out</span>
            <span class="date-value">${checkoutFormatted}</span>
          </div>
        </div>
        
        <div class="booking-info">
          <p><i class="fas fa-users"></i> ${booking.guests || 2} Guests</p>
          <p><i class="fas fa-moon"></i> ${booking.nights || 1} Nights</p>
          <p class="booking-total"><i class="fas fa-tag"></i> ₦${(booking.total_amount || 0).toLocaleString()}</p>
        </div>
      </div>
      
      <!-- Action Buttons -->
      <div class="booking-actions">
        ${createBookingActionButtons(booking, isUpcoming, status)}
      </div>
    </div>
  `;
}

/**
 * Creates action buttons for booking cards based on status and dates
 * 
 * @param {Object} booking - Booking data object
 * @param {boolean} isUpcoming - Whether booking is in the future
 * @param {string} status - Booking status
 * @returns {string} HTML string for action buttons
 */
function createBookingActionButtons(booking, isUpcoming, status) {
  if (status === 'cancelled') {
    return `
      <button class="btn-secondary" onclick="bookAgain('${booking.hotel_id}')">
        <i class="fas fa-redo"></i> Book Again
      </button>
    `;
  }
  
  if (isUpcoming) {
    return `
      <button class="btn-outline" onclick="viewBookingDetails('${booking._id}')">
        <i class="fas fa-eye"></i> View Details
      </button>
      <button class="btn-danger" onclick="cancelBooking('${booking._id}')">
        <i class="fas fa-times"></i> Cancel
      </button>
    `;
  }
  
  // Past bookings
  return `
    <button class="btn-outline" onclick="viewBookingDetails('${booking._id}')">
      <i class="fas fa-eye"></i> View Details
    </button>
    <button class="btn-secondary" onclick="bookAgain('${booking.hotel_id}')">
      <i class="fas fa-redo"></i> Book Again
    </button>
  `;
}

// ========================================
// BOOKING ACTION FUNCTIONS
// ========================================

/**
 * Redirects to hotel details page for rebooking
 * 
 * @param {string} hotelId - Hotel ID to book again
 */
function bookAgain(hotelId) {
  if (hotelId) {
    window.location.href = `/hotel/${hotelId}`;
  } else {
    console.error('Hotel ID not provided for rebooking');
  }
}

/**
 * Shows booking details in a modal or separate page
 * 
 * @param {string} bookingId - Booking ID to view details
 */
function viewBookingDetails(bookingId) {
  // Find booking in allBookings array
  const booking = allBookings.find(b => b._id === bookingId);
  
  if (booking) {
    // Show booking details modal or navigate to details page
    console.log('Viewing booking details:', booking);
    
    // For now, show an alert with booking details
    // In production, this would open a modal or navigate to a details page
    alert(`Booking Details:\nHotel: ${booking.hotel_name}\nDates: ${booking.check_in} to ${booking.check_out}\nTotal: ₦${booking.total_amount?.toLocaleString()}`);
  } else {
    console.error('Booking not found:', bookingId);
  }
}

/**
 * Cancels a booking with user confirmation
 * 
 * @param {string} bookingId - Booking ID to cancel
 */
async function cancelBooking(bookingId) {
  // Confirm cancellation with user
  const confirmed = confirm('Are you sure you want to cancel this booking? This action cannot be undone.');
  
  if (!confirmed) return;
  
  try {
    // Make API call to cancel booking
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      if (window.BookingUtils) {
        BookingUtils.showSuccess('Booking cancelled successfully');
      } else {
        alert('Booking cancelled successfully');
      }
      
      // Reload bookings to reflect changes
      await loadBookings();
    } else {
      throw new Error(result.message || 'Failed to cancel booking');
    }
    
  } catch (error) {
    console.error('Error cancelling booking:', error);
    
    // Show error message
    if (window.BookingUtils) {
      BookingUtils.showError('Failed to cancel booking. Please try again.');
    } else {
      alert('Failed to cancel booking. Please try again.');
    }
  }
}

// ========================================
// PROFILE MANAGEMENT FUNCTIONS
// ========================================

/**
 * Updates user profile information
 * Handles profile form submission and validation
 */
async function updateProfile() {
  const profileForm = document.getElementById('profile-form');
  
  if (!profileForm) return;
  
  const formData = new FormData(profileForm);
  const profileData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone')
  };
  
  try {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (window.BookingUtils) {
        BookingUtils.showSuccess('Profile updated successfully');
      } else {
        alert('Profile updated successfully');
      }
    } else {
      throw new Error(result.message || 'Failed to update profile');
    }
    
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if (window.BookingUtils) {
      BookingUtils.showError('Failed to update profile. Please try again.');
    } else {
      alert('Failed to update profile. Please try again.');
    }
  }
}

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadUserData,
    loadBookings,
    initDashboard,
    filterBookings,
    createBookingCard,
    bookAgain,
    viewBookingDetails,
    cancelBooking,
    updateProfile
  };
}