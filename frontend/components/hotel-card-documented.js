/**
 * HOTEL CARD COMPONENT - REUSABLE HOTEL DISPLAY COMPONENTS
 * ========================================================
 * 
 * This component library provides reusable hotel card components for displaying
 * hotel information across different pages of the application.
 * 
 * Features:
 * - Grid-style hotel cards for homepage and search results
 * - List-style hotel cards for detailed hotel listings
 * - Lazy loading image support for performance
 * - Star rating system with half-star support
 * - Amenity icons with automatic mapping
 * - Price formatting with Nigerian Naira
 * - Click handlers for navigation
 * - Error handling for missing images
 * 
 * Components:
 * - createHotelCard() - Compact card for grids
 * - createHotelListCard() - Detailed card for lists
 * - createStars() - Star rating generator
 * - getAmenityIcon() - Amenity icon mapper
 * - fetchHotels() - API integration
 * 
 * Usage:
 * const hotelCard = createHotelCard(hotelData);
 * document.getElementById('hotels-grid').innerHTML = hotelCard;
 * 
 * Dependencies:
 * - Font Awesome icons for amenities and ratings
 * - Lazy loading CSS classes
 * - Hotel API endpoints
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// GLOBAL VARIABLES
// ========================================

/**
 * Array to store all fetched hotels
 * Used for filtering and searching
 * @type {Array<Object>}
 */
let allHotels = [];

/**
 * Array to store currently displayed hotels
 * Updated when filters are applied
 * @type {Array<Object>}
 */
let currentHotels = [];

// ========================================
// MAIN HOTEL CARD COMPONENTS
// ========================================

/**
 * Creates a compact hotel card for grid layouts
 * Used on homepage, search results, and grid views
 * 
 * @param {Object} hotel - Hotel data object
 * @param {string} hotel._id - Unique hotel identifier
 * @param {string} hotel.name - Hotel name
 * @param {string} hotel.location - Hotel location
 * @param {number} [hotel.rating=4.0] - Hotel rating (0-5)
 * @param {Array} [hotel.rooms] - Array of room objects
 * @param {Array} [hotel.images] - Array of image URLs
 * @returns {string} HTML string for hotel card
 */
function createHotelCard(hotel) {
  // Extract price from first available room, default to 0
  const price = hotel.rooms && hotel.rooms[0] ? hotel.rooms[0].price_per_night : 0;
  
  // Use first image or fallback to default
  const image = hotel.images && hotel.images[0] ? 
    hotel.images[0] : 
    'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  
  return `
    <div class="hotel-card lazy-content" onclick="location.href='/hotel/${hotel._id}'">
      <!-- Hotel Image with Lazy Loading -->
      <img data-src="${image}" 
           alt="${hotel.name}" 
           class="lazy-image" 
           style="background: #f0f0f0; min-height: 200px;"
           onerror="this.dataset.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
      
      <!-- Hotel Information -->
      <div class="hotel-info">
        <!-- Hotel Name -->
        <h3>${hotel.name}</h3>
        
        <!-- Location with Icon -->
        <p class="location">
          <i class="fas fa-map-marker-alt"></i> ${hotel.location}
        </p>
        
        <!-- Star Rating -->
        <div class="rating">
          ${createStars(hotel.rating || 4.0)}
          <span>(${hotel.rating || 4.0})</span>
        </div>
        
        <!-- Price and Booking Button -->
        <div class="price-book">
          <span class="price">₦${price.toLocaleString()}/night</span>
          <button class="book-btn" 
                  onclick="event.stopPropagation(); location.href='/hotel/${hotel._id}'">
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a detailed hotel card for list layouts
 * Used on hotels listing page with more information
 * 
 * @param {Object} hotel - Hotel data object
 * @param {string} hotel._id - Unique hotel identifier
 * @param {string} hotel.name - Hotel name
 * @param {string} hotel.location - Hotel location
 * @param {string} [hotel.description] - Hotel description
 * @param {number} [hotel.rating=4.0] - Hotel rating (0-5)
 * @param {Array} [hotel.rooms] - Array of room objects
 * @param {Array} [hotel.images] - Array of image URLs
 * @param {Array} [hotel.amenities] - Array of amenity strings
 * @returns {string} HTML string for detailed hotel card
 */
function createHotelListCard(hotel) {
  // Extract price from first available room
  const price = hotel.rooms && hotel.rooms[0] ? hotel.rooms[0].price_per_night : 0;
  
  // Use first image or fallback
  const image = hotel.images && hotel.images[0] ? 
    hotel.images[0] : 
    'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  
  // Get amenities array or empty array
  const amenities = hotel.amenities || [];
  
  return `
    <div class="hotel-list-card lazy-content">
      <!-- Hotel Image -->
      <img data-src="${image}" 
           alt="${hotel.name}" 
           class="lazy-image"
           style="background: #f0f0f0; min-height: 150px;"
           onerror="this.dataset.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
      
      <!-- Hotel Details Container -->
      <div class="hotel-details">
        <!-- Main Hotel Information -->
        <div class="hotel-main-info">
          <!-- Hotel Name -->
          <h3>${hotel.name}</h3>
          
          <!-- Location with Icon -->
          <p class="location">
            <i class="fas fa-map-marker-alt"></i> ${hotel.location}
          </p>
          
          <!-- Rating with Reviews Count -->
          <div class="rating">
            <div class="stars">${createStars(hotel.rating || 4.0)}</div>
            <span class="rating-score">
              ${hotel.rating || 4.0} (${Math.floor(Math.random() * 100) + 50} reviews)
            </span>
          </div>
          
          <!-- Amenities List (First 4) -->
          <div class="amenities">
            ${amenities.slice(0, 4).map(amenity => 
              `<span class="amenity">
                <i class="fas fa-${getAmenityIcon(amenity)}"></i> ${amenity}
               </span>`
            ).join('')}
          </div>
          
          <!-- Hotel Description -->
          <p class="description">${hotel.description || ''}</p>
        </div>
        
        <!-- Booking Section -->
        <div class="hotel-booking">
          <!-- Price Information -->
          <div class="price-info">
            <span class="price">₦${price.toLocaleString()}</span>
            <span class="per-night">/night</span>
          </div>
          
          <!-- View Details Button -->
          <button class="view-details-btn" onclick="location.href='/hotel/${hotel._id}'">
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Creates star rating HTML based on numeric rating
 * Supports full stars, half stars, and empty stars
 * 
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 * 
 * @example
 * createStars(4.5) // Returns 4 full stars, 1 half star
 * createStars(3.0) // Returns 3 full stars, 2 empty stars
 */
function createStars(rating) {
  // Calculate number of full stars
  const fullStars = Math.floor(rating);
  
  // Check if there's a half star needed
  const hasHalfStar = rating % 1 !== 0;
  
  let stars = '';
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // Add empty stars to complete 5-star rating
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
}

/**
 * Maps amenity names to Font Awesome icon classes
 * Provides consistent iconography across the application
 * 
 * @param {string} amenity - Amenity name
 * @returns {string} Font Awesome icon class name (without 'fa-' prefix)
 * 
 * @example
 * getAmenityIcon('Free WiFi') // Returns 'wifi'
 * getAmenityIcon('Swimming Pool') // Returns 'swimming-pool'
 * getAmenityIcon('Unknown') // Returns 'check' (fallback)
 */
function getAmenityIcon(amenity) {
  /**
   * Icon mapping object
   * Maps common amenity names to appropriate Font Awesome icons
   */
  const iconMap = {
    'Free WiFi': 'wifi',
    'WiFi': 'wifi',
    'Swimming Pool': 'swimming-pool',
    'Pool': 'swimming-pool',
    'Gym': 'dumbbell',
    'Spa': 'spa',
    'Restaurant': 'utensils',
    'Bar': 'cocktail',
    'Parking': 'car',
    'Breakfast': 'coffee',
    'Beach Access': 'umbrella-beach',
    'Room Service': 'concierge-bell',
    'Laundry': 'tshirt',
    'Air Conditioning': 'snowflake',
    'Pet Friendly': 'paw',
    'Business Center': 'briefcase',
    'Conference Room': 'users',
    'Elevator': 'elevator',
    'Balcony': 'building',
    'Kitchen': 'utensils'
  };
  
  // Return mapped icon or fallback to 'check'
  return iconMap[amenity] || 'check';
}

// ========================================
// API INTEGRATION FUNCTIONS
// ========================================

/**
 * Fetches hotels data from the backend API
 * Handles API errors and provides fallback data
 * 
 * @returns {Promise<Array<Object>>} Array of hotel objects
 * 
 * @example
 * const hotels = await fetchHotels();
 * hotels.forEach(hotel => {
 *   console.log(hotel.name, hotel.location);
 * });
 */
async function fetchHotels() {
  try {
    // Make API request to hotels endpoint
    const response = await fetch('/api/hotels');
    const data = await response.json();
    
    // Check if API request was successful
    if (data.success) {
      // Store hotels in global variable for filtering
      allHotels = data.hotels;
      currentHotels = [...data.hotels];
      
      return data.hotels;
    } else {
      // Log API error and return empty array
      console.error('Failed to fetch hotels:', data.message);
      return getFallbackHotels();
    }
  } catch (error) {
    // Handle network or parsing errors
    console.error('Error fetching hotels:', error);
    return getFallbackHotels();
  }
}

/**
 * Provides fallback hotel data when API is unavailable
 * Ensures the application continues to function with sample data
 * 
 * @returns {Array<Object>} Array of sample hotel objects
 * @private
 */
function getFallbackHotels() {
  return [
    {
      _id: 'hotel1',
      name: 'Grand Palace Hotel',
      location: 'Victoria Island, Lagos',
      description: '5-star luxury hotel with ocean view and world-class amenities',
      rating: 4.8,
      rooms: [{ price_per_night: 45000 }],
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945'],
      amenities: ['Free WiFi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant']
    },
    {
      _id: 'hotel2',
      name: 'Ocean View Resort',
      location: 'Lekki, Lagos',
      description: 'Beachfront resort with stunning ocean views',
      rating: 4.6,
      rooms: [{ price_per_night: 48000 }],
      images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'],
      amenities: ['Beach Access', 'Free WiFi', 'Pool', 'Restaurant']
    }
  ];
}

// ========================================
// HOTEL FILTERING AND SEARCH FUNCTIONS
// ========================================

/**
 * Filters hotels based on search criteria
 * Updates the currentHotels array with filtered results
 * 
 * @param {Object} filters - Filter criteria object
 * @param {string} [filters.location] - Location to filter by
 * @param {number} [filters.minPrice] - Minimum price per night
 * @param {number} [filters.maxPrice] - Maximum price per night
 * @param {number} [filters.minRating] - Minimum rating
 * @param {Array<string>} [filters.amenities] - Required amenities
 * @returns {Array<Object>} Filtered array of hotels
 */
function filterHotels(filters = {}) {
  let filtered = [...allHotels];
  
  // Filter by location (case-insensitive partial match)
  if (filters.location) {
    const location = filters.location.toLowerCase();
    filtered = filtered.filter(hotel => 
      hotel.location.toLowerCase().includes(location) ||
      hotel.name.toLowerCase().includes(location)
    );
  }
  
  // Filter by price range
  if (filters.minPrice || filters.maxPrice) {
    filtered = filtered.filter(hotel => {
      const price = hotel.rooms && hotel.rooms[0] ? hotel.rooms[0].price_per_night : 0;
      const meetsMin = !filters.minPrice || price >= filters.minPrice;
      const meetsMax = !filters.maxPrice || price <= filters.maxPrice;
      return meetsMin && meetsMax;
    });
  }
  
  // Filter by minimum rating
  if (filters.minRating) {
    filtered = filtered.filter(hotel => 
      (hotel.rating || 0) >= filters.minRating
    );
  }
  
  // Filter by required amenities
  if (filters.amenities && filters.amenities.length > 0) {
    filtered = filtered.filter(hotel => {
      const hotelAmenities = hotel.amenities || [];
      return filters.amenities.every(amenity => 
        hotelAmenities.includes(amenity)
      );
    });
  }
  
  // Update current hotels array
  currentHotels = filtered;
  
  return filtered;
}

/**
 * Sorts hotels by specified criteria
 * Modifies the currentHotels array in place
 * 
 * @param {string} sortBy - Sort criteria ('price', 'rating', 'name')
 * @param {string} [order='asc'] - Sort order ('asc' or 'desc')
 * @returns {Array<Object>} Sorted array of hotels
 */
function sortHotels(sortBy, order = 'asc') {
  const multiplier = order === 'desc' ? -1 : 1;
  
  currentHotels.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'price':
        valueA = a.rooms && a.rooms[0] ? a.rooms[0].price_per_night : 0;
        valueB = b.rooms && b.rooms[0] ? b.rooms[0].price_per_night : 0;
        break;
      case 'rating':
        valueA = a.rating || 0;
        valueB = b.rating || 0;
        break;
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return -1 * multiplier;
    if (valueA > valueB) return 1 * multiplier;
    return 0;
  });
  
  return currentHotels;
}

// ========================================
// RENDERING FUNCTIONS
// ========================================

/**
 * Renders hotels in grid layout
 * Used for homepage and grid view pages
 * 
 * @param {Array<Object>} hotels - Array of hotel objects to render
 * @param {string} containerId - ID of container element
 * @param {boolean} [showSkeleton=true] - Whether to show loading skeleton
 */
function renderHotelsGrid(hotels, containerId, showSkeleton = true) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return;
  }
  
  // Show skeleton loading if requested
  if (showSkeleton) {
    showSkeletons(container, 'hotel-card', 4);
  }
  
  // Generate hotel cards HTML
  const hotelCards = hotels.map(hotel => createHotelCard(hotel)).join('');
  
  // Update container content
  if (showSkeleton) {
    // Hide skeletons and show content
    setTimeout(() => {
      hideSkeletons(container, hotelCards);
    }, 600);
  } else {
    container.innerHTML = hotelCards;
  }
}

/**
 * Renders hotels in list layout
 * Used for hotels listing page
 * 
 * @param {Array<Object>} hotels - Array of hotel objects to render
 * @param {string} containerId - ID of container element
 */
function renderHotelsList(hotels, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return;
  }
  
  // Generate hotel list cards HTML
  const hotelCards = hotels.map(hotel => createHotelListCard(hotel)).join('');
  
  // Update container content
  container.innerHTML = hotelCards || '<p class="no-results">No hotels found matching your criteria.</p>';
}

// ========================================
// SKELETON LOADING FUNCTIONS
// ========================================

/**
 * Shows skeleton loading placeholders
 * Provides visual feedback while content loads
 * 
 * @param {HTMLElement} container - Container element
 * @param {string} skeletonType - Type of skeleton ('hotel-card', 'hotel-list')
 * @param {number} count - Number of skeletons to show
 */
function showSkeletons(container, skeletonType, count) {
  const skeletonHTML = Array(count).fill(0).map(() => 
    `<div class="skeleton ${skeletonType}-skeleton"></div>`
  ).join('');
  
  container.innerHTML = skeletonHTML;
  container.classList.add('skeleton-container');
}

/**
 * Hides skeleton loading and shows actual content
 * 
 * @param {HTMLElement} container - Container element
 * @param {string} content - HTML content to show
 */
function hideSkeletons(container, content) {
  container.classList.remove('skeleton-container');
  container.innerHTML = content;
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize hotel card component when DOM is ready
 * Sets up lazy loading and other features
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize lazy loading for hotel images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    // Observe all lazy images
    document.querySelectorAll('.lazy-image').forEach(img => {
      imageObserver.observe(img);
    });
  }
});

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createHotelCard,
    createHotelListCard,
    createStars,
    getAmenityIcon,
    fetchHotels,
    filterHotels,
    sortHotels,
    renderHotelsGrid,
    renderHotelsList
  };
}