// Hotel Card Component with Lazy Loading
function createHotelCard(hotel) {
  const price = hotel.rooms && hotel.rooms[0] ? hotel.rooms[0].price_per_night : 0;
  const image = hotel.images && hotel.images[0] ? hotel.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945';

  return `
    <div class="hotel-card lazy-content" onclick="location.href='/hotel/${hotel._id}'">
      <img data-src="${image}" alt="${hotel.name}" class="lazy-image" 
           style="background: #f0f0f0; min-height: 200px;"
           onerror="this.dataset.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
      <div class="hotel-info">
        <h3>${hotel.name}</h3>
        <p class="location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
        <div class="rating">
          ${createStars(hotel.rating || 4.0)}
          <span>(${hotel.rating || 4.0})</span>
        </div>
        <div class="price-book">
          <span class="price">₦${price.toLocaleString()}/night</span>
          <button class="book-btn" onclick="event.stopPropagation(); location.href='/hotel/${hotel._id}'">View Details</button>
        </div>
      </div>
    </div>
  `;
}

// Hotel List Card Component with Lazy Loading
function createHotelListCard(hotel) {
  const price = hotel.rooms && hotel.rooms[0] ? hotel.rooms[0].price_per_night : 0;
  const image = hotel.images && hotel.images[0] ? hotel.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  const amenities = hotel.amenities || [];

  return `
    <div class="hotel-list-card lazy-content">
      <img data-src="${image}" alt="${hotel.name}" class="lazy-image"
           style="background: #f0f0f0; min-height: 150px;"
           onerror="this.dataset.src='https://images.unsplash.com/photo-1566073771259-6a8506099945'">
      <div class="hotel-details">
        <div class="hotel-main-info">
          <h3>${hotel.name}</h3>
          <p class="location"><i class="fas fa-map-marker-alt"></i> ${hotel.location}</p>
          <div class="rating">
            <div class="stars">${createStars(hotel.rating || 4.0)}</div>
            <span class="rating-score">${hotel.rating || 4.0} (${Math.floor(Math.random() * 100) + 50} reviews)</span>
          </div>
          <div class="amenities">
            ${amenities.slice(0, 4).map(amenity =>
    `<span class="amenity"><i class="fas fa-${getAmenityIcon(amenity)}"></i> ${amenity}</span>`
  ).join('')}
          </div>
          <p class="description">${hotel.description || ''}</p>
        </div>
        <div class="hotel-booking">
          <div class="price-info">
            <span class="price">₦${price.toLocaleString()}</span>
            <span class="per-night">/night</span>
          </div>
          <button class="view-details-btn" onclick="location.href='/hotel/${hotel._id}'">View Details</button>
        </div>
      </div>
    </div>
  `;
}

// Create star rating
function createStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }

  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }

  return stars;
}

// Amenity icon mapping
function getAmenityIcon(amenity) {
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
    'Laundry': 'tshirt'
  };
  return iconMap[amenity] || 'check';
}

// API functions
async function fetchHotels() {
  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/hotels`);
    const data = await response.json();
    if (data.success) {
      return data.hotels;
    } else {
      console.error('Failed to fetch hotels:', data.message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

// Global hotels variable
let allHotels = [];
let currentHotels = [];