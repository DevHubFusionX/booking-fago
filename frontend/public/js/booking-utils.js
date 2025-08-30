// Booking Utilities - Helper functions for the booking process
class BookingUtils {
  static formatCurrency(amount) {
    return `₦${amount.toLocaleString()}`;
  }
  
  static formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  static calculateNights(checkin, checkout) {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    return Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
  }
  
  static calculateTotal(pricePerNight, nights, serviceFeeRate = 0.05) {
    const subtotal = pricePerNight * nights;
    const serviceFee = subtotal * serviceFeeRate;
    const total = subtotal + serviceFee;
    
    return {
      subtotal,
      serviceFee,
      total
    };
  }
  
  static validateBookingData(bookingData) {
    const required = ['hotelId', 'hotelName', 'checkin', 'checkout', 'guests', 'roomType', 'pricePerNight'];
    const missing = required.filter(field => !bookingData[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required booking data: ${missing.join(', ')}`);
    }
    
    // Validate dates
    const checkin = new Date(bookingData.checkin);
    const checkout = new Date(bookingData.checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkin < today) {
      throw new Error('Check-in date cannot be in the past');
    }
    
    if (checkout <= checkin) {
      throw new Error('Check-out date must be after check-in date');
    }
    
    return true;
  }
  
  static validateGuestDetails(guestDetails) {
    const required = ['firstName', 'lastName', 'email', 'phone'];
    const missing = required.filter(field => !guestDetails[field] || guestDetails[field].trim() === '');
    
    if (missing.length > 0) {
      throw new Error(`Please fill in all required fields: ${missing.join(', ')}`);
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestDetails.email)) {
      throw new Error('Please enter a valid email address');
    }
    
    return true;
  }
  
  static showError(message, duration = 5000) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.booking-error');
    existingErrors.forEach(error => error.remove());
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'booking-error';
    errorDiv.innerHTML = `
      <div class="error-content">
        <i class="fas fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add styles
    errorDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dc3545;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after duration
    setTimeout(() => {
      if (errorDiv.parentElement) {
        errorDiv.remove();
      }
    }, duration);
  }
  
  static showSuccess(message, duration = 5000) {
    // Remove existing success messages
    const existingSuccess = document.querySelectorAll('.booking-success');
    existingSuccess.forEach(success => success.remove());
    
    // Create success element
    const successDiv = document.createElement('div');
    successDiv.className = 'booking-success';
    successDiv.innerHTML = `
      <div class="success-content">
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button class="success-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    // Add styles
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    // Auto remove after duration
    setTimeout(() => {
      if (successDiv.parentElement) {
        successDiv.remove();
      }
    }, duration);
  }
  
  static showLoading(element, text = 'Loading...') {
    const originalContent = element.innerHTML;
    element.dataset.originalContent = originalContent;
    element.innerHTML = `
      <i class="fas fa-spinner fa-spin"></i>
      <span>${text}</span>
    `;
    element.disabled = true;
  }
  
  static hideLoading(element) {
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
      delete element.dataset.originalContent;
    }
    element.disabled = false;
  }
  
  static async makeAPIRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }
  
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  static generateBookingReference() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `FB${timestamp}${random}`.toUpperCase();
  }
}

// Add CSS for notifications
const notificationCSS = `
<style>
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.booking-error .error-content,
.booking-success .success-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-close,
.success-close {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: auto;
}

.error-close:hover,
.success-close:hover {
  opacity: 0.8;
}
</style>
`;

// Inject notification CSS
if (typeof document !== 'undefined') {
  document.head.insertAdjacentHTML('beforeend', notificationCSS);
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.BookingUtils = BookingUtils;
}