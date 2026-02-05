// Booking Management JavaScript
function createBookingCard(booking) {
  const checkinDate = new Date(booking.check_in);
  const checkoutDate = new Date(booking.check_out);
  const isUpcoming = checkinDate > new Date();
  const status = booking.booking_status || (booking.payment_status === 'paid' ? (isUpcoming ? 'confirmed' : 'completed') : 'pending');

  return `
    <div class="booking-card ${isUpcoming ? 'upcoming' : 'past'} ${status}" data-status="${status}">
      <div class="booking-status">
        <span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
      <div class="booking-details">
        <div class="hotel-info">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100" alt="Hotel">
          <div>
            <h3>${booking.hotel_name || 'Hotel'}</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${booking.hotel_location || 'Location'}</p>
            <p><i class="fas fa-bed"></i> ${booking.room_type}</p>
            <p class="booking-ref">Booking #${booking._id.slice(-8)}</p>
          </div>
        </div>
        <div class="booking-dates">
          <div class="date-info">
            <span class="label">Check-in</span>
            <span class="date">${checkinDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div class="date-info">
            <span class="label">Check-out</span>
            <span class="date">${checkoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <div class="booking-price">
          <span class="total">₦${booking.total_amount.toLocaleString()}</span>
          <span class="nights">${booking.nights || 1} nights • ${booking.guests} guests</span>
        </div>
      </div>
      <div class="booking-actions">
        <button class="btn-secondary" onclick="viewBookingDetails('${booking._id}')">View Details</button>
        ${isUpcoming && status !== 'cancelled' ? '<button class="btn-danger" onclick="cancelBooking(\'' + booking._id + '\')">Cancel Booking</button>' : '<button class="btn-primary" onclick="bookAgain(\'' + booking.hotel_id + '\')">Book Again</button>'}
      </div>
    </div>
  `;
}

async function viewBookingDetails(bookingId) {
  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/bookings/${bookingId}`);
    const data = await response.json();

    if (data.success) {
      showBookingModal(data.booking);
    } else {
      // Find booking in current list
      const booking = allBookings.find(b => b._id === bookingId);
      if (booking) {
        showBookingModal(booking);
      } else {
        alert('Booking details not found');
      }
    }
  } catch (error) {
    const booking = allBookings.find(b => b._id === bookingId);
    if (booking) {
      showBookingModal(booking);
    } else {
      alert('Error loading booking details');
    }
  }
}

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
    return;
  }

  try {
    const response = await fetch(`${window.API_BASE_URL || ''}/api/bookings/${bookingId}/cancel`, {
      method: 'POST'
    });

    const data = await response.json();

    if (data.success) {
      alert('Booking cancelled successfully');
      loadBookings(); // Reload bookings
    } else {
      // Update locally if API fails
      const bookingCard = document.querySelector(`[data-status]:has(button[onclick*="${bookingId}"])`);
      if (bookingCard) {
        bookingCard.querySelector('.status-badge').textContent = 'Cancelled';
        bookingCard.querySelector('.status-badge').className = 'status-badge cancelled';
        bookingCard.dataset.status = 'cancelled';
        const cancelBtn = bookingCard.querySelector('.btn-danger');
        if (cancelBtn) {
          cancelBtn.outerHTML = `<button class="btn-primary" onclick="bookAgain('${bookingId}')">Book Again</button>`;
        }
      }
      alert('Booking cancelled successfully');
    }
  } catch (error) {
    alert('Error cancelling booking. Please try again.');
  }
}