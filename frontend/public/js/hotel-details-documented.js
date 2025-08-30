/**
 * HOTEL DETAILS PAGE FUNCTIONALITY
 * ================================
 * 
 * This module handles all functionality for the hotel details page.
 * It manages hotel data loading, room selection, image gallery, and booking integration.
 * 
 * Features:
 * - Dynamic hotel details loading from API
 * - Interactive room selection with pricing
 * - Image gallery with lazy loading
 * - Amenities display with icons
 * - Star rating system
 * - Integration with booking form
 * - Responsive design with mobile support
 * - Error handling and fallback content
 * 
 * Page Components:
 * - Hotel information display (name, location, description, rating)
 * - Image gallery with main image and thumbnails
 * - Room options with selection functionality
 * - Amenities grid with Font Awesome icons
 * - Booking form integration
 * 
 * Dependencies:
 * - Hotel API for fetching hotel details
 * - Booking form functionality
 * - Lazy loading system for images
 * - Authentication system
 * - Hotel card component for utility functions
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// GLOBAL VARIABLES
// ========================================

/**
 * Current hotel data object
 * Stores all hotel information loaded from API
 * @type {Object|null}
 */
let currentHotel = null;

/**
 * Currently selected room object
 * Used for booking calculations and form submission
 * @type {Object|null}
 */
let selectedRoom = null;

// ========================================
// PAGE INITIALIZATION
// ========================================

/**
 * Initialize hotel details page when DOM is ready
 * Sets up all functionality and loads hotel data
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize mobile navigation menu
  initMobileMenu();
  
  // Load hotel details from API
  await loadHotelDetails();
  
  // Initialize booking form functionality
  initBookingForm();
  
  // Update authentication navbar (multiple attempts to ensure loading)
  setTimeout(updateNavbarAuth, 100);
  setTimeout(updateNavbarAuth, 500);
  setTimeout(updateNavbarAuth, 1000);
  
  console.log('🏨 Hotel details page initialized');
});

// ========================================
// HOTEL DATA LOADING
// ========================================

/**
 * Loads hotel details from API based on URL parameter
 * Extracts hotel ID from URL path and fetches hotel data
 * Handles loading states, errors, and displays hotel information
 */
async function loadHotelDetails() {
  // Extract hotel ID from URL path (e.g., /hotel/hotel123 -> hotel123)
  const hotelId = window.location.pathname.split('/').pop();
  
  if (!hotelId) {
    console.error('No hotel ID found in URL');
    showHotelNotFound();
    return;
  }
  
  try {
    console.log(`🔍 Loading hotel details for ID: ${hotelId}`);
    
    // Fetch hotel details from API
    const response = await fetch(`/api/hotels/${hotelId}`);
    const data = await response.json();
    
    if (data.success && data.hotel) {
      // Store hotel data globally
      currentHotel = data.hotel;
      
      // Display hotel information
      displayHotelDetails(currentHotel);
      
      console.log('✅ Hotel details loaded:', currentHotel.name);
    } else {
      console.error('Hotel not found:', data.message);
      showHotelNotFound();
    }
    
  } catch (error) {
    console.error('Error loading hotel details:', error);
    
    // Show error message to user
    if (window.BookingUtils) {
      BookingUtils.showError('Failed to load hotel details. Please try again.');
    }
    
    showHotelNotFound();
  }
}

/**
 * Displays hotel not found error page
 * Shows user-friendly error message with navigation options
 */
function showHotelNotFound() {
  const pageContainer = document.querySelector('.hotel-details-page');
  if (pageContainer) {
    pageContainer.innerHTML = `
      <div class="container">
        <div class="error-state">
          <i class="fas fa-hotel" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
          <h2>Hotel Not Found</h2>
          <p>The hotel you're looking for doesn't exist or has been removed.</p>
          <div class="error-actions">
            <a href="/hotels" class="btn-primary">Browse All Hotels</a>
            <a href="/" class="btn-secondary">Go Home</a>
          </div>
        </div>
      </div>
    `;
  }
}

// ========================================
// HOTEL DETAILS DISPLAY
// ========================================

/**
 * Displays hotel details in the page
 * Updates all hotel information elements with fetched data
 * 
 * @param {Object} hotel - Hotel data object from API
 */
function displayHotelDetails(hotel) {
  // Get default image or first available image
  const image = hotel.images && hotel.images[0] ? 
    hotel.images[0] : 
    'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  
  // ========================================
  // UPDATE BASIC HOTEL INFORMATION
  // ========================================
  
  // Update hotel name
  const hotelNameElement = document.getElementById('hotel-name');
  if (hotelNameElement) {
    hotelNameElement.textContent = hotel.name;
  }
  
  // Update location with icon
  const locationElement = document.querySelector('.location');
  if (locationElement) {
    locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${hotel.location}`;
  }
  
  // Update description
  const descriptionElement = document.querySelector('.hotel-description p');
  if (descriptionElement) {
    descriptionElement.textContent = hotel.description || 
      'Experience luxury and comfort at this beautiful hotel.';
  }
  
  // ========================================
  // UPDATE MAIN HOTEL IMAGE
  // ========================================
  
  const mainImage = document.getElementById('main-hotel-image');
  if (mainImage) {
    // Set up lazy loading for main image
    mainImage.dataset.src = image;
    mainImage.classList.add('lazy-image');
    
    // Initialize lazy loading if available
    if (window.lazyLoader) {
      window.lazyLoader.observeImages();
    }
  }
  
  // ========================================
  // UPDATE ROOM OPTIONS
  // ========================================
  
  displayRoomOptions(hotel.rooms || []);
  
  // ========================================
  // UPDATE AMENITIES
  // ========================================
  
  const amenitiesGrid = document.querySelector('.amenities-grid');
  if (amenitiesGrid && hotel.amenities && hotel.amenities.length > 0) {
    amenitiesGrid.innerHTML = hotel.amenities.map(amenity => 
      `<div class="amenity">
         <i class="fas fa-${getAmenityIcon(amenity)}"></i> 
         ${amenity}
       </div>`
    ).join('');
  }
  
  // ========================================
  // UPDATE RATING DISPLAY
  // ========================================
  
  const rating = hotel.rating || 4.0;
  
  // Update star rating
  const starsElement = document.querySelector('.stars');
  if (starsElement) {
    starsElement.innerHTML = createStars(rating);
  }
  
  // Update rating text with review count
  const ratingTextElement = document.querySelector('.rating span');
  if (ratingTextElement) {
    const reviewCount = Math.floor(Math.random() * 100) + 50; // Generate random review count
    ratingTextElement.textContent = `${rating} (${reviewCount} reviews)`;
  }
  
  // ========================================
  // UPDATE PAGE TITLE
  // ========================================
  
  // Update browser tab title
  document.title = `${hotel.name} - Fago's Booking`;
  
  console.log('🎨 Hotel details displayed successfully');
}

// ========================================
// ROOM OPTIONS DISPLAY
// ========================================

/**
 * Displays available room options with skeleton loading
 * Creates interactive room cards with selection functionality
 * 
 * @param {Array<Object>} rooms - Array of room objects
 */
function displayRoomOptions(rooms) {
  const roomsList = document.getElementById('rooms-list');
  
  if (!roomsList) {
    console.warn('Rooms list element not found');
    return;
  }
  
  // Handle empty rooms array
  if (rooms.length === 0) {
    roomsList.innerHTML = `
      <div class="no-rooms">
        <i class="fas fa-bed"></i>
        <p>No rooms available at this time.</p>
        <p>Please check back later or contact the hotel directly.</p>
      </div>
    `;
    return;
  }
  
  // Show skeleton loading animation
  if (window.showSkeletons) {
    showSkeletons(roomsList, 'room-option', rooms.length);
  }
  
  // Simulate loading delay for better UX
  setTimeout(() => {
    // Generate room option cards
    const roomCards = rooms.map((room, index) => createRoomOptionCard(room, index)).join('');
    
    // Hide skeletons and show content
    if (window.hideSkeletons) {
      hideSkeletons(roomsList, roomCards);
    } else {
      roomsList.innerHTML = roomCards;
    }
    
    console.log(`🛏️ Displayed ${rooms.length} room options`);
  }, 400);
}

/**
 * Creates HTML for a room option card
 * Generates interactive room selection card with details and pricing
 * 
 * @param {Object} room - Room data object
 * @param {number} index - Room index for selection handling
 * @returns {string} HTML string for room option card
 */
function createRoomOptionCard(room, index) {
  return `
    <div class="room-option lazy-content" data-room-index="${index}">
      <!-- Room Information -->
      <div class="room-info">
        <h4>${room.room_type}</h4>
        <div class="room-details">
          <p><i class="fas fa-users"></i> Capacity: ${room.capacity} guests</p>
          <p><i class="fas fa-bed"></i> ${getRoomBedInfo(room)}</p>
          <p><i class="fas fa-wifi"></i> Free WiFi included</p>
        </div>
        <p class="room-price">
          <span class="currency">₦</span>
          <span class="amount">${room.price_per_night.toLocaleString()}</span>
          <span class="period">/night</span>
        </p>
      </div>
      
      <!-- Room Features -->
      <div class="room-features">
        ${getRoomFeatures(room)}
      </div>
      
      <!-- Selection Button -->
      <button class="select-room-btn" onclick="selectRoom(${index})">
        <i class="fas fa-check"></i>
        Select Room
      </button>
    </div>
  `;
}

/**
 * Gets bed information for room display
 * 
 * @param {Object} room - Room data object
 * @returns {string} Bed information text
 */
function getRoomBedInfo(room) {
  // Generate bed info based on room type and capacity
  if (room.room_type.toLowerCase().includes('suite')) {
    return 'King bed + Sofa bed';
  } else if (room.capacity >= 3) {
    return 'Queen bed + Single bed';
  } else {
    return 'Queen bed';
  }
}

/**
 * Gets room features based on room type
 * 
 * @param {Object} room - Room data object
 * @returns {string} HTML string for room features
 */
function getRoomFeatures(room) {
  const features = [];
  
  // Add features based on room type
  if (room.room_type.toLowerCase().includes('suite')) {
    features.push('<i class="fas fa-couch"></i> Separate living area');
    features.push('<i class="fas fa-bath"></i> Luxury bathroom');
  }
  
  if (room.room_type.toLowerCase().includes('deluxe')) {
    features.push('<i class="fas fa-mountain"></i> City/Ocean view');
    features.push('<i class="fas fa-coffee"></i> Coffee machine');
  }
  
  // Default features for all rooms
  features.push('<i class="fas fa-snowflake"></i> Air conditioning');
  features.push('<i class="fas fa-tv"></i> Flat-screen TV');
  
  return features.map(feature => `<div class="feature">${feature}</div>`).join('');
}

// ========================================
// ROOM SELECTION FUNCTIONALITY
// ========================================

/**
 * Handles room selection
 * Updates UI state and enables booking functionality
 * 
 * @param {number} roomIndex - Index of selected room in rooms array
 */
function selectRoom(roomIndex) {
  if (!currentHotel || !currentHotel.rooms || !currentHotel.rooms[roomIndex]) {
    console.error('Invalid room selection');
    return;
  }
  
  // Store selected room globally
  selectedRoom = currentHotel.rooms[roomIndex];
  
  // ========================================
  // UPDATE ROOM SELECTION UI
  // ========================================
  
  // Update room option cards
  document.querySelectorAll('.room-option').forEach((option, index) => {
    option.classList.toggle('selected', index === roomIndex);
    
    // Update button text for selected room
    const button = option.querySelector('.select-room-btn');
    if (index === roomIndex) {
      button.innerHTML = '<i class="fas fa-check-circle"></i> Selected';
      button.classList.add('selected');
    } else {
      button.innerHTML = '<i class="fas fa-check"></i> Select Room';
      button.classList.remove('selected');
    }
  });
  
  // ========================================
  // ENABLE BOOKING FUNCTIONALITY
  // ========================================
  
  // Enable booking button
  const bookBtn = document.getElementById('book-now-btn');
  if (bookBtn) {
    bookBtn.disabled = false;
    bookBtn.textContent = `Book ${selectedRoom.room_type}`;
    bookBtn.classList.add('enabled');
  }
  
  // Update booking form with selected room
  updateBookingFormWithRoom(selectedRoom);
  
  // Recalculate pricing if dates are selected
  if (typeof calculateTotal === 'function') {
    calculateTotal();
  }
  
  console.log('✅ Room selected:', selectedRoom.room_type);
  
  // Show success feedback
  if (window.BookingUtils) {
    BookingUtils.showSuccess(`${selectedRoom.room_type} selected!`);
  }
}

/**
 * Updates booking form with selected room information
 * 
 * @param {Object} room - Selected room object
 */
function updateBookingFormWithRoom(room) {
  // Update room type display in booking form
  const roomTypeElement = document.getElementById('selected-room-type');
  if (roomTypeElement) {
    roomTypeElement.textContent = room.room_type;
  }
  
  // Update price display in booking form
  const priceElement = document.getElementById('room-price-display');
  if (priceElement) {
    priceElement.textContent = `₦${room.price_per_night.toLocaleString()}/night`;
  }
  
  // Update capacity information
  const capacityElement = document.getElementById('room-capacity');
  if (capacityElement) {
    capacityElement.textContent = `Up to ${room.capacity} guests`;
  }
}

// ========================================
// IMAGE GALLERY FUNCTIONALITY
// ========================================

/**
 * Changes the main hotel image
 * Updates the main image when thumbnail is clicked
 * 
 * @param {string} src - Image source URL
 */
function changeImage(src) {
  const mainImage = document.getElementById('main-hotel-image');
  if (mainImage && src) {
    // Update image source with higher resolution
    const highResSrc = src.replace('w=200', 'w=800');
    mainImage.src = highResSrc;
    
    // Update active thumbnail
    updateActiveThumbnail(src);
    
    console.log('🖼️ Main image changed');
  }
}

/**
 * Updates active thumbnail indicator
 * 
 * @param {string} src - Source of the active image
 */
function updateActiveThumbnail(src) {
  const thumbnails = document.querySelectorAll('.thumbnail');
  thumbnails.forEach(thumb => {
    thumb.classList.toggle('active', thumb.src === src);
  });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Scrolls to booking form section
 * Smooth scroll to booking form when "Book Now" is clicked
 */
function scrollToBookingForm() {
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Shares hotel details
 * Opens native share dialog or copies URL to clipboard
 */
function shareHotel() {
  if (navigator.share && currentHotel) {
    navigator.share({
      title: currentHotel.name,
      text: `Check out ${currentHotel.name} in ${currentHotel.location}`,
      url: window.location.href
    });
  } else {
    // Fallback: copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
      if (window.BookingUtils) {
        BookingUtils.showSuccess('Hotel link copied to clipboard!');
      } else {
        alert('Hotel link copied to clipboard!');
      }
    });
  }
}

/**
 * Adds hotel to favorites
 * Saves hotel to user's favorites list
 */
async function addToFavorites() {
  if (!currentHotel) return;
  
  try {
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        hotelId: currentHotel._id
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (window.BookingUtils) {
        BookingUtils.showSuccess('Hotel added to favorites!');
      } else {
        alert('Hotel added to favorites!');
      }
      
      // Update favorites button
      const favBtn = document.getElementById('favorite-btn');
      if (favBtn) {
        favBtn.innerHTML = '<i class="fas fa-heart"></i> Favorited';
        favBtn.classList.add('favorited');
      }
    } else {
      throw new Error(result.message || 'Failed to add to favorites');
    }
    
  } catch (error) {
    console.error('Error adding to favorites:', error);
    
    if (window.BookingUtils) {
      BookingUtils.showError('Failed to add to favorites. Please try again.');
    } else {
      alert('Failed to add to favorites. Please try again.');
    }
  }
}

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadHotelDetails,
    displayHotelDetails,
    displayRoomOptions,
    selectRoom,
    changeImage,
    shareHotel,
    addToFavorites,
    scrollToBookingForm
  };
}