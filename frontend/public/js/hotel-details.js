// Hotel Details Page JavaScript
let currentHotel = null;
let selectedRoom = null;

document.addEventListener('DOMContentLoaded', async () => {
  initMobileMenu();
  await loadHotelDetails();
  initBookingForm();
  
  // Update auth state multiple times to ensure it's loaded
  setTimeout(updateNavbarAuth, 100);
  setTimeout(updateNavbarAuth, 500);
  setTimeout(updateNavbarAuth, 1000);
});

async function loadHotelDetails() {
  const hotelId = window.location.pathname.split('/').pop();
  try {
    const response = await fetch(`/api/hotels/${hotelId}`);
    const data = await response.json();
    
    if (data.success) {
      currentHotel = data.hotel;
      displayHotelDetails(currentHotel);
    } else {
      console.error('Hotel not found');
      document.querySelector('.hotel-details-page').innerHTML = '<div class="container"><h2>Hotel not found</h2></div>';
    }
  } catch (error) {
    console.error('Error loading hotel details:', error);
    if (window.BookingUtils) {
      BookingUtils.showError('Failed to load hotel details');
    }
  }
}

function displayHotelDetails(hotel) {
  const image = hotel.images && hotel.images[0] ? hotel.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  
  document.getElementById('hotel-name').textContent = hotel.name;
  document.querySelector('.location').innerHTML = `<i class="fas fa-map-marker-alt"></i> ${hotel.location}`;
  document.querySelector('.hotel-description p').textContent = hotel.description || 'Experience luxury and comfort at this beautiful hotel.';
  const mainImage = document.getElementById('main-hotel-image');
  mainImage.dataset.src = image;
  mainImage.classList.add('lazy-image');
  if (window.lazyLoader) {
    window.lazyLoader.observeImages();
  }
  
  // Display room options
  displayRoomOptions(hotel.rooms || []);
  
  // Update amenities
  const amenitiesGrid = document.querySelector('.amenities-grid');
  if (hotel.amenities && hotel.amenities.length > 0) {
    amenitiesGrid.innerHTML = hotel.amenities.map(amenity => 
      `<div class="amenity"><i class="fas fa-${getAmenityIcon(amenity)}"></i> ${amenity}</div>`
    ).join('');
  }
  
  // Update rating
  const rating = hotel.rating || 4.0;
  const stars = document.querySelector('.stars');
  stars.innerHTML = createStars(rating);
  document.querySelector('.rating span').textContent = `${rating} (${Math.floor(Math.random() * 100) + 50} reviews)`;
}

function displayRoomOptions(rooms) {
  const roomsList = document.getElementById('rooms-list');
  
  if (rooms.length === 0) {
    roomsList.innerHTML = '<p>No rooms available</p>';
    return;
  }
  
  // Show skeletons first
  if (window.showSkeletons) {
    showSkeletons(roomsList, 'room-option', rooms.length);
  }
  
  // Simulate loading delay
  setTimeout(() => {
    const roomCards = rooms.map((room, index) => `
      <div class="room-option lazy-content" data-room-index="${index}">
        <div class="room-info">
          <h4>${room.room_type}</h4>
          <p>Capacity: ${room.capacity} guests</p>
          <p class="room-price">₦${room.price_per_night.toLocaleString()}/night</p>
        </div>
        <button class="select-room-btn" onclick="selectRoom(${index})">Select</button>
      </div>
    `).join('');
    
    if (window.hideSkeletons) {
      hideSkeletons(roomsList, roomCards);
    } else {
      roomsList.innerHTML = roomCards;
    }
  }, 400);
}

function selectRoom(roomIndex) {
  selectedRoom = currentHotel.rooms[roomIndex];
  
  // Update UI
  document.querySelectorAll('.room-option').forEach((option, index) => {
    option.classList.toggle('selected', index === roomIndex);
  });
  
  // Enable booking button
  const bookBtn = document.getElementById('book-now-btn');
  bookBtn.disabled = false;
  bookBtn.textContent = 'Book Now';
  
  // Update pricing
  calculateTotal();
}

function changeImage(src) {
  document.getElementById('main-hotel-image').src = src.replace('w=200', 'w=800');
}