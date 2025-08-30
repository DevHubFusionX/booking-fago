// UI Helper Functions
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
    'Beach Access': 'umbrella-beach'
  };
  return iconMap[amenity] || 'check';
}

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

function initMobileMenu() {
  createMobileSidebar();
  document.getElementById('mobile-menu').addEventListener('click', openSidebar);
  document.querySelector('.sidebar-close').addEventListener('click', closeSidebar);
  document.querySelector('.sidebar-overlay').addEventListener('click', closeSidebar);
}

function createMobileSidebar() {
  const sidebarHTML = `
    <div class="sidebar-overlay"></div>
    <div class="mobile-sidebar">
      <div class="sidebar-header">
        <h3>FAGO</h3>
        <button class="sidebar-close"><i class="fas fa-times"></i></button>
      </div>
      <nav class="sidebar-nav">
        <a href="/">Home</a>
        <a href="/hotels">Hotels</a>
        <a href="/deals">Deals</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
      <div class="sidebar-auth">
        <a href="/login" class="login-btn">Login / Sign Up</a>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', sidebarHTML);
}

function openSidebar() {
  document.querySelector('.sidebar-overlay').classList.add('active');
  document.querySelector('.mobile-sidebar').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  document.querySelector('.sidebar-overlay').classList.remove('active');
  document.querySelector('.mobile-sidebar').classList.remove('active');
  document.body.style.overflow = '';
}