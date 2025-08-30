/**
 * LAZY LOADING AND SKELETON MANAGEMENT SYSTEM
 * ===========================================
 * 
 * This module provides comprehensive lazy loading functionality and skeleton loading
 * animations for improved user experience and performance optimization.
 * 
 * Features:
 * - Image lazy loading with Intersection Observer API
 * - Content lazy loading with scroll-triggered animations
 * - Multiple skeleton loading templates for different components
 * - Automatic fallback for browsers without Intersection Observer
 * - Performance optimized with configurable root margins
 * - CSS animations for smooth loading transitions
 * 
 * Components:
 * - LazyLoader class for managing all lazy loading functionality
 * - Skeleton generators for different UI components
 * - Utility functions for showing/hiding loading states
 * - CSS injection for animations and transitions
 * 
 * Usage:
 * // Automatic initialization on DOM ready
 * // Manual skeleton display:
 * showSkeletons(container, 'hotel-card', 4);
 * hideSkeletons(container, actualContent);
 * 
 * Dependencies:
 * - Intersection Observer API (with fallback)
 * - CSS transitions and animations
 * 
 * Author: Fago's Booking Team
 * Version: 1.0.0
 */

// ========================================
// MAIN LAZY LOADER CLASS
// ========================================

/**
 * LazyLoader class manages all lazy loading functionality
 * Handles both image loading and content animations
 */
class LazyLoader {
  /**
   * Initialize the lazy loader with default settings
   * Sets up observers for images and content
   */
  constructor() {
    /**
     * Intersection Observer for image lazy loading
     * @type {IntersectionObserver|null}
     */
    this.imageObserver = null;
    
    /**
     * Intersection Observer for content animations
     * @type {IntersectionObserver|null}
     */
    this.contentObserver = null;
    
    // Initialize all lazy loading functionality
    this.init();
  }

  /**
   * Initialize all lazy loading components
   * Sets up image and content observers
   */
  init() {
    this.setupImageLazyLoading();
    this.setupContentLazyLoading();
    
    // Log initialization for debugging
    console.log('🖼️ Lazy loading system initialized');
  }

  /**
   * Sets up Intersection Observer for image lazy loading
   * Images load when they're about to enter the viewport
   */
  setupImageLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      /**
       * Image observer configuration
       * rootMargin: Load images 50px before they enter viewport
       * threshold: Trigger when any part of image is visible
       */
      this.imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Check if image is intersecting with viewport
          if (entry.isIntersecting) {
            // Load the image
            this.loadImage(entry.target);
            
            // Stop observing this image (one-time load)
            this.imageObserver.unobserve(entry.target);
          }
        });
      }, { 
        rootMargin: '50px', // Load images 50px before visible
        threshold: 0.1      // Trigger when 10% visible
      });
    } else {
      // Fallback for browsers without Intersection Observer
      console.warn('Intersection Observer not supported, loading all images immediately');
      this.loadAllImagesImmediately();
    }
  }

  /**
   * Sets up Intersection Observer for content animations
   * Content animates in when it enters the viewport
   */
  setupContentLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      /**
       * Content observer configuration
       * rootMargin: Animate content 20px before visible
       * threshold: Trigger when element starts entering viewport
       */
      this.contentObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          // Check if content is intersecting with viewport
          if (entry.isIntersecting) {
            // Add animation class to trigger CSS animations
            entry.target.classList.add('animate-in');
            
            // Stop observing this element (one-time animation)
            this.contentObserver.unobserve(entry.target);
          }
        });
      }, { 
        rootMargin: '20px', // Animate 20px before visible
        threshold: 0.1      // Trigger when 10% visible
      });
    }
  }

  /**
   * Loads a single image from data-src attribute
   * Handles loading states and error fallbacks
   * 
   * @param {HTMLImageElement} img - Image element to load
   */
  loadImage(img) {
    // Get the source URL from data-src attribute
    const src = img.dataset.src;
    
    if (src) {
      // Create a new image to preload
      const imageLoader = new Image();
      
      // Handle successful image load
      imageLoader.onload = () => {
        // Set the actual src attribute
        img.src = src;
        
        // Add loaded class for CSS transitions
        img.classList.add('loaded');
        
        // Remove data-src attribute (cleanup)
        img.removeAttribute('data-src');
        
        // Remove lazy-image class
        img.classList.remove('lazy-image');
      };
      
      // Handle image load errors
      imageLoader.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        
        // Set fallback image if available
        const fallback = img.dataset.fallback || 
          'https://images.unsplash.com/photo-1566073771259-6a8506099945';
        
        img.src = fallback;
        img.classList.add('loaded', 'error');
        img.removeAttribute('data-src');
      };
      
      // Start loading the image
      imageLoader.src = src;
    }
  }

  /**
   * Fallback method for browsers without Intersection Observer
   * Loads all images immediately
   * @private
   */
  loadAllImagesImmediately() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.loadImage(img);
    });
  }

  /**
   * Observes all images with data-src attribute for lazy loading
   * Call this method when new images are added to the DOM
   */
  observeImages() {
    if (this.imageObserver) {
      // Find all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        this.imageObserver.observe(img);
      });
    }
  }

  /**
   * Observes all content with lazy-content class for animations
   * Call this method when new content is added to the DOM
   */
  observeContent() {
    if (this.contentObserver) {
      // Find all elements with lazy-content class
      document.querySelectorAll('.lazy-content').forEach(element => {
        this.contentObserver.observe(element);
      });
    }
  }

  /**
   * Destroys the lazy loader and cleans up observers
   * Call this when the component is no longer needed
   */
  destroy() {
    if (this.imageObserver) {
      this.imageObserver.disconnect();
      this.imageObserver = null;
    }
    
    if (this.contentObserver) {
      this.contentObserver.disconnect();
      this.contentObserver = null;
    }
    
    console.log('🗑️ Lazy loading system destroyed');
  }
}

// ========================================
// SKELETON LOADING TEMPLATES
// ========================================

/**
 * Creates skeleton loading template for hotel cards
 * Used in grid layouts and homepage
 * 
 * @returns {string} HTML string for hotel card skeleton
 */
function createHotelCardSkeleton() {
  return `
    <div class="hotel-card-skeleton">
      <!-- Image placeholder -->
      <div class="skeleton skeleton-image"></div>
      
      <!-- Hotel name placeholder -->
      <div class="skeleton skeleton-title"></div>
      
      <!-- Location placeholder -->
      <div class="skeleton skeleton-location"></div>
      
      <!-- Rating placeholder -->
      <div class="skeleton skeleton-rating"></div>
      
      <!-- Price placeholder -->
      <div class="skeleton skeleton-price"></div>
    </div>
  `;
}

/**
 * Creates skeleton loading template for hotel list cards
 * Used in detailed hotel listings
 * 
 * @returns {string} HTML string for hotel list skeleton
 */
function createHotelListSkeleton() {
  return `
    <div class="hotel-list-skeleton">
      <!-- Hotel image placeholder -->
      <div class="skeleton skeleton-image"></div>
      
      <!-- Hotel content placeholders -->
      <div class="skeleton-content">
        <!-- Hotel name -->
        <div class="skeleton skeleton-title"></div>
        
        <!-- Location -->
        <div class="skeleton skeleton-location"></div>
        
        <!-- Description -->
        <div class="skeleton skeleton-description"></div>
        
        <!-- Amenities placeholders -->
        <div class="skeleton-amenities">
          <div class="skeleton skeleton-amenity"></div>
          <div class="skeleton skeleton-amenity"></div>
          <div class="skeleton skeleton-amenity"></div>
        </div>
        
        <!-- Price -->
        <div class="skeleton skeleton-price"></div>
      </div>
    </div>
  `;
}

/**
 * Creates skeleton loading template for booking cards
 * Used in dashboard and booking history
 * 
 * @returns {string} HTML string for booking card skeleton
 */
function createBookingCardSkeleton() {
  return `
    <div class="booking-card-skeleton">
      <!-- Booking status placeholder -->
      <div class="skeleton-header">
        <div class="skeleton skeleton-status"></div>
      </div>
      
      <!-- Hotel information placeholders -->
      <div class="skeleton-hotel">
        <div class="skeleton skeleton-hotel-image"></div>
        <div class="skeleton-hotel-info">
          <div class="skeleton skeleton-hotel-name"></div>
          <div class="skeleton skeleton-hotel-location"></div>
        </div>
      </div>
      
      <!-- Booking dates placeholders -->
      <div class="skeleton-dates">
        <div class="skeleton skeleton-date"></div>
        <div class="skeleton skeleton-date"></div>
      </div>
      
      <!-- Action buttons placeholders -->
      <div class="skeleton-actions">
        <div class="skeleton skeleton-button"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    </div>
  `;
}

/**
 * Creates skeleton loading template for deal cards
 * Used in deals and promotions sections
 * 
 * @returns {string} HTML string for deal card skeleton
 */
function createDealCardSkeleton() {
  return `
    <div class="deal-card-skeleton">
      <!-- Deal badge placeholder -->
      <div class="skeleton skeleton-badge"></div>
      
      <!-- Deal title placeholder -->
      <div class="skeleton skeleton-title"></div>
      
      <!-- Deal description placeholder -->
      <div class="skeleton skeleton-description"></div>
      
      <!-- Action button placeholder -->
      <div class="skeleton skeleton-button"></div>
    </div>
  `;
}

/**
 * Creates skeleton loading template for room options
 * Used in hotel details and booking pages
 * 
 * @returns {string} HTML string for room option skeleton
 */
function createRoomOptionSkeleton() {
  return `
    <div class="room-option-skeleton">
      <!-- Room information placeholders -->
      <div class="skeleton-room-info">
        <div class="skeleton skeleton-room-type"></div>
        <div class="skeleton skeleton-room-capacity"></div>
        <div class="skeleton skeleton-room-price"></div>
      </div>
      
      <!-- Select button placeholder -->
      <div class="skeleton skeleton-button"></div>
    </div>
  `;
}

// ========================================
// SKELETON MANAGEMENT FUNCTIONS
// ========================================

/**
 * Shows skeleton loading placeholders in a container
 * Provides visual feedback while content is loading
 * 
 * @param {HTMLElement} container - Container element to show skeletons in
 * @param {string} skeletonType - Type of skeleton to show
 * @param {number} [count=3] - Number of skeleton items to display
 * 
 * @example
 * showSkeletons(document.getElementById('hotels'), 'hotel-card', 4);
 */
function showSkeletons(container, skeletonType, count = 3) {
  // Validate container
  if (!container) {
    console.error('Container element is required for showSkeletons');
    return;
  }
  
  /**
   * Map of skeleton types to their generator functions
   * Add new skeleton types here as needed
   */
  const skeletonFunctions = {
    'hotel-card': createHotelCardSkeleton,
    'hotel-list': createHotelListSkeleton,
    'booking-card': createBookingCardSkeleton,
    'deal-card': createDealCardSkeleton,
    'room-option': createRoomOptionSkeleton
  };

  // Get the appropriate skeleton generator function
  const skeletonFunction = skeletonFunctions[skeletonType];
  
  if (skeletonFunction) {
    // Generate the requested number of skeletons
    const skeletonHTML = Array(count).fill(0)
      .map(() => skeletonFunction())
      .join('');
    
    // Insert skeletons into container
    container.innerHTML = skeletonHTML;
    
    // Add skeleton container class for styling
    container.classList.add('skeleton-container');
    
    // Log for debugging
    console.log(`📦 Showing ${count} ${skeletonType} skeletons`);
  } else {
    console.error(`Unknown skeleton type: ${skeletonType}`);
    
    // Show generic skeleton as fallback
    container.innerHTML = Array(count).fill(0)
      .map(() => '<div class="skeleton skeleton-generic"></div>')
      .join('');
  }
}

/**
 * Hides skeleton loading and shows actual content
 * Smoothly transitions from loading state to content
 * 
 * @param {HTMLElement} container - Container element with skeletons
 * @param {string} content - HTML content to display
 * 
 * @example
 * hideSkeletons(container, '<div>Actual content</div>');
 */
function hideSkeletons(container, content) {
  // Validate container
  if (!container) {
    console.error('Container element is required for hideSkeletons');
    return;
  }
  
  // Remove skeleton container class
  container.classList.remove('skeleton-container');
  
  // Replace skeleton content with actual content
  container.innerHTML = content;
  
  // Initialize lazy loading for new content
  if (window.lazyLoader) {
    // Observe new images for lazy loading
    window.lazyLoader.observeImages();
    
    // Observe new content for animations
    window.lazyLoader.observeContent();
  }
  
  // Log for debugging
  console.log('✨ Skeletons hidden, content displayed');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Creates a lazy-loaded image element with placeholder
 * Provides consistent image loading across the application
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text for accessibility
 * @param {string} [className=''] - Additional CSS classes
 * @param {string} [fallback] - Fallback image URL
 * @returns {string} HTML string for lazy image
 * 
 * @example
 * const imageHTML = createLazyImage(
 *   'https://example.com/image.jpg',
 *   'Hotel exterior',
 *   'hotel-image',
 *   'https://example.com/fallback.jpg'
 * );
 */
function createLazyImage(src, alt, className = '', fallback = null) {
  // Set default fallback if none provided
  const defaultFallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  const fallbackSrc = fallback || defaultFallback;
  
  return `
    <img 
      data-src="${src}" 
      data-fallback="${fallbackSrc}"
      alt="${alt}" 
      class="lazy-image ${className}"
      style="background: #f0f0f0; min-height: 200px;"
      onload="this.style.background='none'"
      loading="lazy"
    />
  `;
}

/**
 * Preloads critical images for better performance
 * Use for above-the-fold images that should load immediately
 * 
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
function preloadCriticalImages(imageUrls) {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
  
  console.log(`🚀 Preloaded ${imageUrls.length} critical images`);
}

/**
 * Checks if an element is in the viewport
 * Useful for manual lazy loading implementations
 * 
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ========================================
// CSS ANIMATIONS AND STYLES
// ========================================

/**
 * CSS styles for lazy loading animations and skeleton loading
 * Injected into the document head for consistent styling
 */
const animationCSS = `
<style>
/* Lazy Image Styles */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.lazy-image.loaded {
  opacity: 1;
  animation: none;
  background: none;
}

.lazy-image.error {
  opacity: 0.7;
  filter: grayscale(100%);
}

/* Lazy Content Styles */
.lazy-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.lazy-content.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Skeleton Loading Styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-container {
  min-height: 200px;
}

/* Skeleton Animations */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Skeleton Dimensions */
.skeleton-image { height: 200px; margin-bottom: 12px; }
.skeleton-title { height: 20px; width: 80%; margin-bottom: 8px; }
.skeleton-location { height: 16px; width: 60%; margin-bottom: 8px; }
.skeleton-rating { height: 16px; width: 40%; margin-bottom: 8px; }
.skeleton-price { height: 18px; width: 50%; }
.skeleton-description { height: 14px; width: 90%; margin-bottom: 6px; }
.skeleton-amenity { height: 12px; width: 80px; margin-right: 8px; display: inline-block; }
.skeleton-button { height: 36px; width: 120px; border-radius: 6px; }
.skeleton-badge { height: 24px; width: 60px; border-radius: 12px; margin-bottom: 8px; }
.skeleton-status { height: 20px; width: 100px; border-radius: 10px; }
.skeleton-date { height: 16px; width: 80px; }
.skeleton-hotel-image { height: 60px; width: 60px; border-radius: 4px; }
.skeleton-hotel-name { height: 18px; width: 150px; margin-bottom: 4px; }
.skeleton-hotel-location { height: 14px; width: 120px; }
.skeleton-room-type { height: 18px; width: 120px; margin-bottom: 4px; }
.skeleton-room-capacity { height: 14px; width: 80px; margin-bottom: 4px; }
.skeleton-room-price { height: 16px; width: 100px; }
.skeleton-generic { height: 20px; width: 100%; margin-bottom: 8px; }

/* Responsive Skeleton Styles */
@media (max-width: 768px) {
  .skeleton-image { height: 150px; }
  .skeleton-title { width: 90%; }
  .skeleton-description { width: 95%; }
}
</style>
`;

// ========================================
// INITIALIZATION AND GLOBAL SETUP
// ========================================

/**
 * Initialize the lazy loading system when DOM is ready
 * Sets up global lazy loader instance and injects CSS
 */
document.addEventListener('DOMContentLoaded', () => {
  // Create global lazy loader instance
  window.lazyLoader = new LazyLoader();
  
  // Observe existing images and content
  window.lazyLoader.observeImages();
  window.lazyLoader.observeContent();
  
  console.log('🎉 Lazy loading system ready');
});

// Inject CSS styles into document head
document.head.insertAdjacentHTML('beforeend', animationCSS);

// ========================================
// GLOBAL EXPORTS
// ========================================

// Export functions for global use across the application
window.showSkeletons = showSkeletons;
window.hideSkeletons = hideSkeletons;
window.createLazyImage = createLazyImage;
window.preloadCriticalImages = preloadCriticalImages;
window.isInViewport = isInViewport;

// Export skeleton generators for custom use
window.skeletonGenerators = {
  hotelCard: createHotelCardSkeleton,
  hotelList: createHotelListSkeleton,
  bookingCard: createBookingCardSkeleton,
  dealCard: createDealCardSkeleton,
  roomOption: createRoomOptionSkeleton
};

// ========================================
// PERFORMANCE MONITORING
// ========================================

/**
 * Monitor lazy loading performance
 * Logs metrics for optimization
 */
if (typeof PerformanceObserver !== 'undefined') {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure' && entry.name.includes('lazy-load')) {
        console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
}

// ========================================
// EXPORT FOR MODULE SYSTEMS (if needed)
// ========================================

// If using module system, export the main classes and functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LazyLoader,
    showSkeletons,
    hideSkeletons,
    createLazyImage,
    preloadCriticalImages,
    isInViewport,
    skeletonGenerators: {
      hotelCard: createHotelCardSkeleton,
      hotelList: createHotelListSkeleton,
      bookingCard: createBookingCardSkeleton,
      dealCard: createDealCardSkeleton,
      roomOption: createRoomOptionSkeleton
    }
  };
}