// Booking Form JavaScript
function initBookingForm() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkin').min = today;
  document.getElementById('checkout').min = today;

  document.getElementById('checkin').addEventListener('change', calculateTotal);
  document.getElementById('checkout').addEventListener('change', calculateTotal);
  document.getElementById('booking-form').addEventListener('submit', handleBooking);
}

function calculateTotal() {
  const checkin = new Date(document.getElementById('checkin').value);
  const checkout = new Date(document.getElementById('checkout').value);

  if (checkin && checkout && checkout > checkin && selectedRoom) {
    const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const pricePerNight = selectedRoom.price_per_night;
    const subtotal = nights * pricePerNight;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;

    document.getElementById('booking-summary').innerHTML = `
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
}

async function handleBooking(e) {
  e.preventDefault();

  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/user`);
    const userData = await response.json();

    if (!userData.user) {
      if (window.BookingUtils) {
        BookingUtils.showError('Please login to make a booking');
        setTimeout(() => window.location.href = '/login', 2000);
      } else {
        alert('Please login to make a booking');
        window.location.href = '/login';
      }
      return;
    }

    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;

    if (!checkin || !checkout) {
      if (window.BookingUtils) {
        BookingUtils.showError('Please select check-in and check-out dates');
      } else {
        alert('Please select check-in and check-out dates');
      }
      return;
    }

    if (!selectedRoom) {
      if (window.BookingUtils) {
        BookingUtils.showError('Please select a room type');
      } else {
        alert('Please select a room type');
      }
      return;
    }

    // Validate dates
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkinDate < today) {
      if (window.BookingUtils) {
        BookingUtils.showError('Check-in date cannot be in the past');
      } else {
        alert('Check-in date cannot be in the past');
      }
      return;
    }

    if (checkoutDate <= checkinDate) {
      if (window.BookingUtils) {
        BookingUtils.showError('Check-out date must be after check-in date');
      } else {
        alert('Check-out date must be after check-in date');
      }
      return;
    }

    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    const subtotal = nights * selectedRoom.price_per_night;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;

    const bookingData = {
      hotelId: currentHotel._id,
      hotelName: currentHotel.name,
      hotelLocation: currentHotel.location,
      checkin,
      checkout,
      guests: parseInt(guests),
      nights,
      roomType: selectedRoom.room_type,
      pricePerNight: selectedRoom.price_per_night,
      subtotal,
      serviceFee,
      total
    };

    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    if (window.BookingUtils) {
      BookingUtils.showSuccess('Redirecting to booking page...');
      setTimeout(() => window.location.href = '/booking', 1000);
    } else {
      window.location.href = '/booking';
    }

  } catch (error) {
    console.error('Error checking authentication:', error);
    if (window.BookingUtils) {
      BookingUtils.showError('Please login to make a booking');
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      alert('Please login to make a booking');
      window.location.href = '/login';
    }
  }
}