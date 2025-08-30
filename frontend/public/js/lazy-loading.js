// Lazy Loading and Skeleton Management
class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.contentObserver = null;
    this.init();
  }

  init() {
    this.setupImageLazyLoading();
    this.setupContentLazyLoading();
  }

  setupImageLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.imageObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '50px' });
    }
  }

  setupContentLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.contentObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '20px' });
    }
  }

  loadImage(img) {
    const src = img.dataset.src;
    if (src) {
      img.src = src;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    }
  }

  observeImages() {
    if (this.imageObserver) {
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.imageObserver.observe(img);
      });
    }
  }

  observeContent() {
    if (this.contentObserver) {
      document.querySelectorAll('.lazy-content').forEach(element => {
        this.contentObserver.observe(element);
      });
    }
  }
}

// Skeleton Generator Functions
function createHotelCardSkeleton() {
  return `
    <div class="hotel-card-skeleton">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-location"></div>
      <div class="skeleton skeleton-rating"></div>
      <div class="skeleton skeleton-price"></div>
    </div>
  `;
}

function createHotelListSkeleton() {
  return `
    <div class="hotel-list-skeleton">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-location"></div>
        <div class="skeleton skeleton-description"></div>
        <div class="skeleton-amenities">
          <div class="skeleton skeleton-amenity"></div>
          <div class="skeleton skeleton-amenity"></div>
          <div class="skeleton skeleton-amenity"></div>
        </div>
        <div class="skeleton skeleton-price"></div>
      </div>
    </div>
  `;
}

function createBookingCardSkeleton() {
  return `
    <div class="booking-card-skeleton">
      <div class="skeleton-header">
        <div class="skeleton skeleton-status"></div>
      </div>
      <div class="skeleton-hotel">
        <div class="skeleton skeleton-hotel-image"></div>
        <div class="skeleton-hotel-info">
          <div class="skeleton skeleton-hotel-name"></div>
          <div class="skeleton skeleton-hotel-location"></div>
        </div>
      </div>
      <div class="skeleton-dates">
        <div class="skeleton skeleton-date"></div>
        <div class="skeleton skeleton-date"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton skeleton-button"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    </div>
  `;
}

function createDealCardSkeleton() {
  return `
    <div class="deal-card-skeleton">
      <div class="skeleton skeleton-badge"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-description"></div>
      <div class="skeleton skeleton-button"></div>
    </div>
  `;
}

function createRoomOptionSkeleton() {
  return `
    <div class="room-option-skeleton">
      <div class="skeleton-room-info">
        <div class="skeleton skeleton-room-type"></div>
        <div class="skeleton skeleton-room-capacity"></div>
        <div class="skeleton skeleton-room-price"></div>
      </div>
      <div class="skeleton skeleton-button"></div>
    </div>
  `;
}

// Show skeletons while loading
function showSkeletons(container, skeletonType, count = 3) {
  const skeletonFunctions = {
    'hotel-card': createHotelCardSkeleton,
    'hotel-list': createHotelListSkeleton,
    'booking-card': createBookingCardSkeleton,
    'deal-card': createDealCardSkeleton,
    'room-option': createRoomOptionSkeleton
  };

  const skeletonFunction = skeletonFunctions[skeletonType];
  if (skeletonFunction) {
    container.innerHTML = Array(count).fill(skeletonFunction()).join('');
  }
}

// Hide skeletons and show content
function hideSkeletons(container, content) {
  container.innerHTML = content;
  
  // Initialize lazy loading for new content
  if (window.lazyLoader) {
    window.lazyLoader.observeImages();
    window.lazyLoader.observeContent();
  }
}

// Enhanced image loading with placeholder
function createLazyImage(src, alt, className = '') {
  return `
    <img 
      data-src="${src}" 
      alt="${alt}" 
      class="lazy-image ${className}"
      style="background: #f0f0f0; min-height: 200px;"
      onload="this.style.background='none'"
    />
  `;
}

// Initialize lazy loader
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();
});

// CSS for animations
const animationCSS = `
<style>
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}

.lazy-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.lazy-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.skeleton-container {
  min-height: 200px;
}
</style>
`;

// Inject animation CSS
document.head.insertAdjacentHTML('beforeend', animationCSS);

// Export functions for global use
window.showSkeletons = showSkeletons;
window.hideSkeletons = hideSkeletons;
window.createLazyImage = createLazyImage;