// Booking Modal JavaScript
function showBookingModal(booking) {
  const checkinDate = new Date(booking.check_in);
  const checkoutDate = new Date(booking.check_out);
  const status = booking.booking_status || (booking.payment_status === 'paid' ? 'confirmed' : 'pending');
  
  const modalHTML = `
    <div class="modal-overlay" onclick="closeBookingModal()">
      <div class="booking-modal" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h2>Booking Details</h2>
          <button class="modal-close" onclick="closeBookingModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-content">
          <div class="booking-info">
            <div class="info-section">
              <h3>Hotel Information</h3>
              <p><strong>Hotel:</strong> ${booking.hotel_name}</p>
              <p><strong>Location:</strong> ${booking.hotel_location}</p>
              <p><strong>Room Type:</strong> ${booking.room_type}</p>
            </div>
            <div class="info-section">
              <h3>Booking Details</h3>
              <p><strong>Booking ID:</strong> #${booking._id.slice(-8)}</p>
              <p><strong>Status:</strong> <span class="status-badge ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span></p>
              <p><strong>Check-in:</strong> ${checkinDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Check-out:</strong> ${checkoutDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><strong>Guests:</strong> ${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}</p>
              <p><strong>Nights:</strong> ${booking.nights || 1}</p>
            </div>
            <div class="info-section">
              <h3>Payment Information</h3>
              <p><strong>Room Rate:</strong> ₦${booking.price_per_night ? booking.price_per_night.toLocaleString() : '0'}/night</p>
              <p><strong>Subtotal:</strong> ₦${booking.subtotal ? booking.subtotal.toLocaleString() : '0'}</p>
              <p><strong>Service Fee:</strong> ₦${booking.service_fee ? booking.service_fee.toLocaleString() : '0'}</p>
              <p><strong>Total Amount:</strong> ₦${booking.total_amount.toLocaleString()}</p>
              <p><strong>Payment Status:</strong> ${booking.payment_status || 'pending'}</p>
              ${booking.transaction_reference ? `<p><strong>Transaction Ref:</strong> ${booking.transaction_reference}</p>` : ''}
            </div>
            ${booking.guest_details ? `
            <div class="info-section">
              <h3>Guest Details</h3>
              <p><strong>Name:</strong> ${booking.guest_details.firstName} ${booking.guest_details.lastName}</p>
              <p><strong>Email:</strong> ${booking.guest_details.email}</p>
              <p><strong>Phone:</strong> ${booking.guest_details.phone}</p>
              ${booking.guest_details.requests ? `<p><strong>Special Requests:</strong> ${booking.guest_details.requests}</p>` : ''}
            </div>
            ` : ''}
          </div>
        </div>
        <div class="modal-actions">
          ${checkinDate > new Date() && status !== 'cancelled' ? '<button class="btn-danger" onclick="cancelBooking(\'' + booking._id + '\'); closeBookingModal();">Cancel Booking</button>' : ''}
          <button class="btn-primary" onclick="bookAgain('${booking.hotel_id}')">Book Again</button>
          <button class="btn-secondary" onclick="closeBookingModal()">Close</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeBookingModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}